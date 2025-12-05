// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { FHE, euint8, euint16, ebool } from "@fhevm/solidity/lib/FHE.sol";
import { SepoliaConfig } from "@fhevm/solidity/config/ZamaConfig.sol";

contract AnonymousEpidemicTracker is SepoliaConfig {

    address public healthAuthority;
    uint8 public currentPeriod;
    uint256 public lastPeriodTime;

    // Period duration in seconds (24 hours = 86400 seconds)
    uint256 constant PERIOD_DURATION = 86400;

    struct HealthReport {
        euint8 encryptedSymptomScore; // 0-10 scale for symptom severity
        euint8 encryptedExposureLevel; // 0-5 scale for exposure risk
        bool hasReported;
        uint256 timestamp;
    }

    struct EpidemicPeriod {
        euint16 totalSymptomSum;
        euint16 totalExposureSum;
        bool periodActive;
        bool periodEnded;
        uint16 participantCount;
        uint256 startTime;
        uint256 endTime;
        address[] reporters;
    }

    mapping(uint8 => EpidemicPeriod) public periods;
    mapping(uint8 => mapping(address => HealthReport)) public healthReports;
    mapping(address => bool) public authorizedReporters;

    // Alert thresholds (can be adjusted by health authority)
    uint16 public symptomAlertThreshold = 50;
    uint16 public exposureAlertThreshold = 30;

    event PeriodStarted(uint8 indexed period, uint256 startTime);
    event HealthReportSubmitted(address indexed reporter, uint8 indexed period);
    event PeriodAnalyzed(uint8 indexed period, bool symptomAlert, bool exposureAlert);
    event AlertTriggered(uint8 indexed period, string alertType, uint16 aggregatedValue);
    event ReporterAuthorized(address indexed reporter);
    event ReporterRevoked(address indexed reporter);

    modifier onlyHealthAuthority() {
        require(msg.sender == healthAuthority, "Not authorized health authority");
        _;
    }

    modifier onlyAuthorizedReporter() {
        require(authorizedReporters[msg.sender], "Not authorized reporter");
        _;
    }

    modifier onlyDuringActivePeriod() {
        require(isPeriodActive(), "No active reporting period");
        _;
    }

    constructor() {
        healthAuthority = msg.sender;
        currentPeriod = 1;
        lastPeriodTime = block.timestamp;

        // Auto-authorize the deployer as first reporter for testing
        authorizedReporters[msg.sender] = true;
    }

    // Check if current period is active for reporting
    function isPeriodActive() public view returns (bool) {
        if (!periods[currentPeriod].periodActive) return false;
        if (periods[currentPeriod].periodEnded) return false;
        return (block.timestamp - periods[currentPeriod].startTime) < PERIOD_DURATION;
    }

    // Check if period should be analyzed
    function shouldAnalyzePeriod() public view returns (bool) {
        if (!periods[currentPeriod].periodActive) return false;
        if (periods[currentPeriod].periodEnded) return false;
        return (block.timestamp - periods[currentPeriod].startTime) >= PERIOD_DURATION;
    }

    // Authorize a new health reporter
    function authorizeReporter(address reporter) external onlyHealthAuthority {
        require(reporter != address(0), "Invalid reporter address");
        authorizedReporters[reporter] = true;
        emit ReporterAuthorized(reporter);
    }

    // Revoke reporter authorization
    function revokeReporter(address reporter) external onlyHealthAuthority {
        authorizedReporters[reporter] = false;
        emit ReporterRevoked(reporter);
    }

    // Start new reporting period
    function startNewPeriod() external onlyHealthAuthority {
        require(!periods[currentPeriod].periodActive || periods[currentPeriod].periodEnded,
                "Current period still active");

        // Initialize encrypted counters to zero
        euint16 zeroSum = FHE.asEuint16(0);

        periods[currentPeriod] = EpidemicPeriod({
            totalSymptomSum: zeroSum,
            totalExposureSum: zeroSum,
            periodActive: true,
            periodEnded: false,
            participantCount: 0,
            startTime: block.timestamp,
            endTime: 0,
            reporters: new address[](0)
        });

        // Grant contract access to encrypted values
        FHE.allowThis(zeroSum);

        emit PeriodStarted(currentPeriod, block.timestamp);
    }

    // Submit anonymous health report
    function submitHealthReport(uint8 _symptomScore, uint8 _exposureLevel)
        external
        onlyAuthorizedReporter
        onlyDuringActivePeriod
    {
        require(_symptomScore <= 10, "Symptom score must be 0-10");
        require(_exposureLevel <= 5, "Exposure level must be 0-5");
        require(!healthReports[currentPeriod][msg.sender].hasReported,
                "Already reported this period");

        // Encrypt the health data
        euint8 encryptedSymptoms = FHE.asEuint8(_symptomScore);
        euint8 encryptedExposure = FHE.asEuint8(_exposureLevel);

        // Store the report
        healthReports[currentPeriod][msg.sender] = HealthReport({
            encryptedSymptomScore: encryptedSymptoms,
            encryptedExposureLevel: encryptedExposure,
            hasReported: true,
            timestamp: block.timestamp
        });

        // Add to period aggregates using FHE operations
        EpidemicPeriod storage period = periods[currentPeriod];
        period.totalSymptomSum = FHE.add(period.totalSymptomSum, FHE.asEuint16(_symptomScore));
        period.totalExposureSum = FHE.add(period.totalExposureSum, FHE.asEuint16(_exposureLevel));
        period.participantCount++;
        period.reporters.push(msg.sender);

        // Set access control permissions
        FHE.allowThis(encryptedSymptoms);
        FHE.allowThis(encryptedExposure);
        FHE.allow(encryptedSymptoms, msg.sender);
        FHE.allow(encryptedExposure, msg.sender);

        emit HealthReportSubmitted(msg.sender, currentPeriod);
    }

    // Analyze period and check for alerts (requires decryption)
    function analyzePeriod() external onlyHealthAuthority {
        require(shouldAnalyzePeriod(), "Period not ready for analysis");
        require(!periods[currentPeriod].periodEnded, "Period already analyzed");

        EpidemicPeriod storage period = periods[currentPeriod];

        // Request decryption for analysis
        bytes32[] memory cts = new bytes32[](2);
        cts[0] = FHE.toBytes32(period.totalSymptomSum);
        cts[1] = FHE.toBytes32(period.totalExposureSum);

        FHE.requestDecryption(cts, this.processAnalysis.selector);
    }

    // Process decrypted analysis results
    function processAnalysis(
        uint256 requestId,
        uint16 totalSymptoms,
        uint16 totalExposure,
        bytes memory decryptionProof
    ) external {
        // Create cleartexts bytes from the decrypted values
        bytes memory cleartexts = abi.encodePacked(totalSymptoms, totalExposure);

        // Verify signatures
        FHE.checkSignatures(requestId, cleartexts, decryptionProof);

        EpidemicPeriod storage period = periods[currentPeriod];
        period.endTime = block.timestamp;
        period.periodEnded = true;

        // Check for alerts based on thresholds
        bool symptomAlert = totalSymptoms > symptomAlertThreshold;
        bool exposureAlert = totalExposure > exposureAlertThreshold;

        if (symptomAlert) {
            emit AlertTriggered(currentPeriod, "HIGH_SYMPTOM_ACTIVITY", totalSymptoms);
        }

        if (exposureAlert) {
            emit AlertTriggered(currentPeriod, "HIGH_EXPOSURE_RISK", totalExposure);
        }

        emit PeriodAnalyzed(currentPeriod, symptomAlert, exposureAlert);

        // Move to next period
        currentPeriod++;
    }

    // Update alert thresholds
    function updateThresholds(uint16 _symptomThreshold, uint16 _exposureThreshold)
        external
        onlyHealthAuthority
    {
        symptomAlertThreshold = _symptomThreshold;
        exposureAlertThreshold = _exposureThreshold;
    }

    // Get current period information
    function getCurrentPeriodInfo() external view returns (
        uint8 period,
        bool active,
        bool ended,
        uint256 startTime,
        uint16 participantCount,
        uint256 timeRemaining
    ) {
        EpidemicPeriod storage currentPeriodData = periods[currentPeriod];
        uint256 remaining = 0;

        if (currentPeriodData.periodActive && !currentPeriodData.periodEnded) {
            uint256 elapsed = block.timestamp - currentPeriodData.startTime;
            if (elapsed < PERIOD_DURATION) {
                remaining = PERIOD_DURATION - elapsed;
            }
        }

        return (
            currentPeriod,
            currentPeriodData.periodActive,
            currentPeriodData.periodEnded,
            currentPeriodData.startTime,
            currentPeriodData.participantCount,
            remaining
        );
    }

    // Check if user has reported in current period
    function hasUserReported(address user) external view returns (
        bool reported,
        uint256 timestamp
    ) {
        HealthReport storage report = healthReports[currentPeriod][user];
        return (report.hasReported, report.timestamp);
    }

    // Get period history (for completed periods only)
    function getPeriodHistory(uint8 periodNumber) external view returns (
        bool ended,
        uint256 startTime,
        uint256 endTime,
        uint16 participantCount
    ) {
        require(periodNumber < currentPeriod || periods[periodNumber].periodEnded,
                "Period not yet completed");

        EpidemicPeriod storage period = periods[periodNumber];
        return (
            period.periodEnded,
            period.startTime,
            period.endTime,
            period.participantCount
        );
    }

    // Emergency function to force period end
    function emergencyEndPeriod() external onlyHealthAuthority {
        require(periods[currentPeriod].periodActive, "No active period");
        require(!periods[currentPeriod].periodEnded, "Period already ended");

        periods[currentPeriod].periodEnded = true;
        periods[currentPeriod].endTime = block.timestamp;

        // Move to next period
        currentPeriod++;
    }

    // Get current timestamp for debugging
    function getCurrentTimestamp() external view returns (uint256) {
        return block.timestamp;
    }
}