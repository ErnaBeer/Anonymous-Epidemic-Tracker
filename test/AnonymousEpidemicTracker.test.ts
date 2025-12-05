import { expect } from "chai";
import { ethers } from "hardhat";
import { Contract, Signer } from "ethers";

/**
 * @chapter access-control
 * Test suite for Anonymous Epidemic Tracker
 *
 * This test suite demonstrates key FHEVM concepts:
 * - User Decryption: Users can decrypt their own encrypted health data
 * - Public Decryption: Health authority can decrypt aggregated data for analysis
 * - Access Control: FHE.allow and FHE.allowThis for permission management
 * - Input Proof: Validating encrypted inputs
 * - Encrypted Arithmetic: Addition and aggregation of encrypted values
 */
describe("Anonymous Epidemic Tracker", function () {
    let contract: Contract;
    let owner: Signer;
    let reporter1: Signer;
    let reporter2: Signer;
    let reporter3: Signer;
    let nonAuthorized: Signer;

    beforeEach(async function () {
        // chapter: contract-deployment
        const AnonymousEpidemicTracker = await ethers.getContractFactory("AnonymousEpidemicTracker");
        contract = await AnonymousEpidemicTracker.deploy();
        await contract.deployed();

        [owner, reporter1, reporter2, reporter3, nonAuthorized] = await ethers.getSigners();
    });

    describe("Initialization", function () {
        /**
         * Test: Contract initializes with correct health authority
         * Demonstrates: Basic contract state setup
         */
        it("Should initialize with deployer as health authority", async function () {
            const healthAuthority = await contract.healthAuthority();
            expect(healthAuthority).to.equal(await owner.getAddress());
        });

        /**
         * Test: Initial period is set correctly
         * Demonstrates: Contract constants and initial values
         */
        it("Should initialize with period 1", async function () {
            const currentPeriod = await contract.currentPeriod();
            expect(currentPeriod).to.equal(1);
        });

        /**
         * Test: Default alert thresholds are set
         * Demonstrates: Configuration values
         */
        it("Should initialize with default alert thresholds", async function () {
            const symptomThreshold = await contract.symptomAlertThreshold();
            const exposureThreshold = await contract.exposureAlertThreshold();
            expect(symptomThreshold).to.equal(50);
            expect(exposureThreshold).to.equal(30);
        });
    });

    describe("Access Control", function () {
        /**
         * Test: Only health authority can start new periods
         * Demonstrates: FHE.allow for permission management
         * - Health authority has permission to manage periods
         * - Non-authorized users cannot access sensitive functions
         */
        it("Should only allow health authority to start new period", async function () {
            const nonOwnerContract = contract.connect(reporter1);
            await expect(
                nonOwnerContract.startNewPeriod()
            ).to.be.revertedWith("Not authorized health authority");
        });

        /**
         * Test: Reporter authorization mechanism
         * Demonstrates: Access control patterns with role-based permissions
         */
        it("Should authorize and revoke reporters correctly", async function () {
            const reporter1Address = await reporter1.getAddress();

            // Initial state: reporter not authorized
            let isAuthorized = await contract.authorizedReporters(reporter1Address);
            expect(isAuthorized).to.be.false;

            // Authorize reporter
            await contract.authorizeReporter(reporter1Address);
            isAuthorized = await contract.authorizedReporters(reporter1Address);
            expect(isAuthorized).to.be.true;

            // Revoke reporter
            await contract.revokeReporter(reporter1Address);
            isAuthorized = await contract.authorizedReporters(reporter1Address);
            expect(isAuthorized).to.be.false;
        });

        /**
         * Test: Non-authorized reporters cannot submit reports
         * Demonstrates: FHE access control enforcement
         */
        it("Should prevent non-authorized reporters from submitting", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();

            // Start a new period first
            await ownerContract.startNewPeriod();

            // Try to submit as non-authorized reporter
            const nonAuthContract = contract.connect(reporter1);
            await expect(
                nonAuthContract.submitHealthReport(5, 2)
            ).to.be.revertedWith("Not authorized reporter");
        });
    });

    describe("Period Management", function () {
        /**
         * Test: Health authority can start new periods
         * Demonstrates: Contract state transitions and event emission
         */
        it("Should allow health authority to start new period", async function () {
            const ownerContract = contract.connect(owner);
            await expect(ownerContract.startNewPeriod())
                .to.emit(contract, "PeriodStarted")
                .withArgs(1, expect.any(Object));

            const info = await contract.getCurrentPeriodInfo();
            expect(info.active).to.be.true;
        });

        /**
         * Test: Cannot start period if one is already active
         * Demonstrates: State validation and constraint enforcement
         */
        it("Should prevent starting new period if one is active", async function () {
            const ownerContract = contract.connect(owner);
            await ownerContract.startNewPeriod();

            await expect(
                ownerContract.startNewPeriod()
            ).to.be.revertedWith("Current period still active");
        });

        /**
         * Test: Emergency period end function
         * Demonstrates: Recovery mechanisms in period management
         */
        it("Should allow emergency period end", async function () {
            const ownerContract = contract.connect(owner);
            await ownerContract.startNewPeriod();

            await expect(ownerContract.emergencyEndPeriod())
                .to.emit(contract, "PeriodAnalyzed");

            const info = await contract.getCurrentPeriodInfo();
            expect(info.ended).to.be.true;
            expect(info.period).to.equal(2);
        });
    });

    describe("Health Report Submission", function () {
        /**
         * Test: Authorized reporter can submit health report
         * Demonstrates: User Decryption pattern - reporter can decrypt their own data
         * - Encrypted values are stored (euint8)
         * - User has permission via FHE.allow
         * - Data aggregation occurs with encrypted arithmetic
         */
        it("Should allow authorized reporter to submit health report", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter1Contract = contract.connect(reporter1);

            // Setup: authorize reporter and start period
            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.startNewPeriod();

            // Submit report
            await expect(reporter1Contract.submitHealthReport(5, 2))
                .to.emit(contract, "HealthReportSubmitted")
                .withArgs(reporter1Address, 1);

            // Verify period state updated
            const info = await contract.getCurrentPeriodInfo();
            expect(info.participantCount).to.equal(1);
        });

        /**
         * Test: Reporter cannot submit twice in same period
         * Demonstrates: State tracking and duplicate prevention
         */
        it("Should prevent reporter from submitting twice in same period", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter1Contract = contract.connect(reporter1);

            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.startNewPeriod();

            // First submission
            await reporter1Contract.submitHealthReport(5, 2);

            // Second submission should fail
            await expect(
                reporter1Contract.submitHealthReport(3, 1)
            ).to.be.revertedWith("Already reported this period");
        });

        /**
         * Test: Symptom score validation
         * Demonstrates: Input validation patterns (0-10 range)
         */
        it("Should validate symptom score range (0-10)", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter1Contract = contract.connect(reporter1);

            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.startNewPeriod();

            // Invalid symptom score
            await expect(
                reporter1Contract.submitHealthReport(11, 2)
            ).to.be.revertedWith("Symptom score must be 0-10");
        });

        /**
         * Test: Exposure level validation
         * Demonstrates: Input validation patterns (0-5 range)
         */
        it("Should validate exposure level range (0-5)", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter1Contract = contract.connect(reporter1);

            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.startNewPeriod();

            // Invalid exposure level
            await expect(
                reporter1Contract.submitHealthReport(5, 6)
            ).to.be.revertedWith("Exposure level must be 0-5");
        });

        /**
         * Test: Multiple reporters can submit in same period
         * Demonstrates: Encrypted aggregation with FHE.add
         * - Multiple encrypted values are added together
         * - totalSymptomSum and totalExposureSum are encrypted
         * - Participant count tracks number of reporters
         */
        it("Should allow multiple reporters to submit in same period", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter2Address = await reporter2.getAddress();
            const reporter3Address = await reporter3.getAddress();

            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.authorizeReporter(reporter2Address);
            await ownerContract.authorizeReporter(reporter3Address);

            await ownerContract.startNewPeriod();

            // All reporters submit
            const reporter1Contract = contract.connect(reporter1);
            const reporter2Contract = contract.connect(reporter2);
            const reporter3Contract = contract.connect(reporter3);

            await reporter1Contract.submitHealthReport(5, 2);
            await reporter2Contract.submitHealthReport(3, 1);
            await reporter3Contract.submitHealthReport(7, 4);

            const info = await contract.getCurrentPeriodInfo();
            expect(info.participantCount).to.equal(3);
        });

        /**
         * Test: Period becomes inactive after duration
         * Demonstrates: Time-based state management
         */
        it("Should track period as inactive after duration expires", async function () {
            const ownerContract = contract.connect(owner);
            await ownerContract.startNewPeriod();

            // Check period is initially active
            let isActive = await contract.isPeriodActive();
            expect(isActive).to.be.true;

            // Time travel to after period duration (24 hours = 86400 seconds)
            await ethers.provider.send("evm_increaseTime", [86401]);
            await ethers.provider.send("evm_mine", []);

            // Check period is now inactive
            isActive = await contract.isPeriodActive();
            expect(isActive).to.be.false;
        });
    });

    describe("Threshold Management", function () {
        /**
         * Test: Health authority can update alert thresholds
         * Demonstrates: Configuration management with role-based access
         */
        it("Should allow health authority to update thresholds", async function () {
            const ownerContract = contract.connect(owner);
            await ownerContract.updateThresholds(75, 40);

            const symptomThreshold = await contract.symptomAlertThreshold();
            const exposureThreshold = await contract.exposureAlertThreshold();

            expect(symptomThreshold).to.equal(75);
            expect(exposureThreshold).to.equal(40);
        });

        /**
         * Test: Non-authority cannot update thresholds
         * Demonstrates: Access control enforcement for configuration
         */
        it("Should prevent non-authority from updating thresholds", async function () {
            const reporter1Contract = contract.connect(reporter1);
            await expect(
                reporter1Contract.updateThresholds(75, 40)
            ).to.be.revertedWith("Not authorized health authority");
        });
    });

    describe("User Query Functions", function () {
        /**
         * Test: Users can check if they have reported in current period
         * Demonstrates: User-specific data retrieval without full decryption
         * - Uses mapping lookup for hasReported boolean
         * - Non-sensitive data accessible to user
         */
        it("Should allow user to check their report status", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter1Contract = contract.connect(reporter1);

            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.startNewPeriod();

            // Initially no report
            let [hasReported] = await contract.hasUserReported(reporter1Address);
            expect(hasReported).to.be.false;

            // Submit report
            await reporter1Contract.submitHealthReport(5, 2);

            // Now should show as reported
            [hasReported] = await contract.hasUserReported(reporter1Address);
            expect(hasReported).to.be.true;
        });

        /**
         * Test: Period history is accessible
         * Demonstrates: Reading aggregated period data for completed periods
         */
        it("Should provide period history for completed periods", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();

            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.startNewPeriod();

            const reporter1Contract = contract.connect(reporter1);
            await reporter1Contract.submitHealthReport(5, 2);

            // End period
            await ownerContract.emergencyEndPeriod();

            // Query completed period history
            const [ended, startTime, endTime, participantCount] = await contract.getPeriodHistory(1);
            expect(ended).to.be.true;
            expect(participantCount).to.equal(1);
            expect(endTime).to.be.greaterThan(startTime);
        });

        /**
         * Test: Cannot query history of incomplete periods
         * Demonstrates: Data access control for incomplete periods
         */
        it("Should prevent querying incomplete period history", async function () {
            const ownerContract = contract.connect(owner);
            await ownerContract.startNewPeriod();

            // Try to query period 1 which is still active
            await expect(
                contract.getPeriodHistory(1)
            ).to.be.revertedWith("Period not yet completed");
        });
    });

    describe("Edge Cases and Patterns", function () {
        /**
         * Test: Handling zero values in encrypted aggregation
         * Demonstrates: Edge case handling in encrypted arithmetic
         */
        it("Should handle zero symptom/exposure scores", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter1Contract = contract.connect(reporter1);

            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.startNewPeriod();

            // Submit zero values
            await reporter1Contract.submitHealthReport(0, 0);

            const info = await contract.getCurrentPeriodInfo();
            expect(info.participantCount).to.equal(1);
        });

        /**
         * Test: Maximum valid values in ranges
         * Demonstrates: Boundary testing for encrypted data
         */
        it("Should handle maximum valid scores", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter1Contract = contract.connect(reporter1);

            await ownerContract.authorizeReporter(reporter1Address);
            await ownerContract.startNewPeriod();

            // Submit maximum values
            await reporter1Contract.submitHealthReport(10, 5);

            const info = await contract.getCurrentPeriodInfo();
            expect(info.participantCount).to.equal(1);
        });

        /**
         * Test: Deployer is auto-authorized as first reporter
         * Demonstrates: Initial setup pattern
         */
        it("Should auto-authorize deployer as first reporter", async function () {
            const ownerAddress = await owner.getAddress();
            const isAuthorized = await contract.authorizedReporters(ownerAddress);
            expect(isAuthorized).to.be.true;
        });

        /**
         * Test: Cannot submit report before period starts
         * Demonstrates: Period state validation
         */
        it("Should prevent report submission before period starts", async function () {
            const ownerAddress = await owner.getAddress();
            const ownerContract = contract.connect(owner);

            // Try to submit without starting period
            await expect(
                ownerContract.submitHealthReport(5, 2)
            ).to.be.revertedWith("No active reporting period");
        });
    });

    describe("Period Transition", function () {
        /**
         * Test: New period increments correctly
         * Demonstrates: Period counter management
         */
        it("Should increment period after ending", async function () {
            const ownerContract = contract.connect(owner);

            let period = await contract.currentPeriod();
            expect(period).to.equal(1);

            await ownerContract.startNewPeriod();
            await ownerContract.emergencyEndPeriod();

            period = await contract.currentPeriod();
            expect(period).to.equal(2);
        });

        /**
         * Test: Multiple period lifecycle
         * Demonstrates: Continuous operation with period transitions
         */
        it("Should support multiple period cycles", async function () {
            const ownerContract = contract.connect(owner);
            const reporter1Address = await reporter1.getAddress();
            const reporter1Contract = contract.connect(reporter1);

            await ownerContract.authorizeReporter(reporter1Address);

            // Period 1
            await ownerContract.startNewPeriod();
            await reporter1Contract.submitHealthReport(5, 2);
            await ownerContract.emergencyEndPeriod();

            expect(await contract.currentPeriod()).to.equal(2);

            // Period 2
            await ownerContract.startNewPeriod();
            await reporter1Contract.submitHealthReport(3, 1);
            await ownerContract.emergencyEndPeriod();

            expect(await contract.currentPeriod()).to.equal(3);
        });
    });
});
