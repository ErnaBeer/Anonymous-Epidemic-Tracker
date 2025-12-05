# Demo Video Script - Anonymous Epidemic Tracker

This document provides a comprehensive guide for creating a demonstration video of the Anonymous Epidemic Tracker FHEVM project. The video should clearly showcase the setup, key features, and core FHEVM concepts.

**Target Duration**: 5-10 minutes
**Required**: As per Zama Bounty requirements, demonstration video is mandatory

---

## Video Structure

### 1. Introduction (30 seconds)

**Screen**: Show project README on GitHub or project directory

**Script**:
> "Hello, I'm presenting the Anonymous Epidemic Tracker, a privacy-preserving health monitoring system built using Zama's Fully Homomorphic Encryption Virtual Machine (FHEVM). This project was created for the Zama Bounty Program December 2025 challenge to demonstrate core FHEVM concepts in a real-world healthcare application."

**Show**:
- Project name and description
- Folder structure with contracts/, test/, scripts/ directories

---

### 2. Problem Statement (30 seconds)

**Screen**: Show README overview section or presentation slides

**Script**:
> "During epidemic outbreaks, health authorities need aggregated data to make informed decisions, but individuals are often concerned about privacy. Traditional systems expose individual health information. Our solution uses FHEVM to enable anonymous health reporting where individuals submit encrypted data, authorities analyze aggregated trends, and individual privacy is preserved throughout."

**Show**:
- Problem diagram: Individual privacy vs. public health needs
- Solution: Encrypted data flow diagram

---

### 3. Key FHEVM Concepts Demonstrated (1-2 minutes)

**Screen**: Show README section on FHEVM concepts

**Script**:
> "This project demonstrates five key FHEVM concepts:
>
> First, User Decryption - reporters encrypt their own health data and retain decryption rights to view their submissions.
>
> Second, Public Decryption - health authorities decrypt only aggregated statistics for analysis, not individual reports.
>
> Third, Encrypted Arithmetic - the contract adds multiple encrypted values without decrypting them, using FHE.add operations.
>
> Fourth, Access Control - using FHE.allow and FHE.allowThis to manage who can access encrypted data.
>
> And fifth, Input Validation - ensuring encrypted inputs fall within valid ranges."

**Show**:
- Code snippets from contract for each concept
- Highlight lines: 137-138 (encryption), 150-151 (FHE.add), 156-159 (access control)

---

### 4. Project Setup (1-2 minutes)

**Screen**: Terminal window

**Script**:
> "Let me show you how to set up the project. First, I'll install dependencies, then compile the contracts, and finally run the comprehensive test suite."

**Commands to show**:
```bash
# Navigate to project
cd anonymous-epidemic-tracker

# Show project structure
dir  # or ls -la on Unix

# Install dependencies
npm install

# Compile contracts
npm run compile

# Show compiled artifacts
dir artifacts/contracts
```

**Narration while running**:
> "Notice we have Hardhat configured with FHEVM support. The compilation process generates type-safe bindings for TypeScript testing."

---

### 5. Contract Walkthrough (2-3 minutes)

**Screen**: VS Code or text editor with AnonymousEpidemicTracker.sol

**Script**:
> "Let's examine the smart contract. At the top, we import FHEVM libraries and configuration."

**Show and highlight**:

#### Section 1: Data Structures (lines 16-32)
```solidity
struct HealthReport {
    euint8 encryptedSymptomScore;    // Encrypted 0-10 scale
    euint8 encryptedExposureLevel;   // Encrypted 0-5 scale
    bool hasReported;
    uint256 timestamp;
}
```

**Script**:
> "Notice the euint8 types - these are encrypted integers that remain encrypted in storage."

#### Section 2: Health Report Submission (lines 126-162)
```solidity
function submitHealthReport(uint8 _symptomScore, uint8 _exposureLevel)
```

**Script**:
> "Here's where reporters submit encrypted health data. The contract encrypts their scores using FHE.asEuint8, grants access permissions, and aggregates the values using FHE.add - all without decrypting the data."

**Highlight**:
- Line 137-138: Encryption
- Line 150-151: Encrypted arithmetic (FHE.add)
- Line 156-159: Access control (FHE.allow, FHE.allowThis)

#### Section 3: Period Analysis (lines 165-177)
```solidity
function analyzePeriod() external onlyHealthAuthority
```

**Script**:
> "After the 24-hour reporting period, health authorities request decryption of the aggregated totals. This demonstrates the public decryption pattern - only the sums are decrypted, never individual reports."

---

### 6. Running Tests (2 minutes)

**Screen**: Terminal window running tests

**Script**:
> "The project includes a comprehensive test suite with over 25 test cases covering all FHEVM concepts. Watch as we run the tests."

**Commands**:
```bash
npm test
```

**Show**:
- Tests running and passing
- Highlight test output showing:
  - Initialization tests
  - Access Control tests
  - Period Management tests
  - Health Report Submission tests
  - User Query Functions tests

**Script during test run**:
> "Notice the tests are organized by chapter tags matching FHEVM concepts: access-control, user-decryption, public-decryption, and encrypted-arithmetic. Each test validates a specific pattern or edge case."

**After tests complete**:
```bash
# Show test coverage if available
npm run test:coverage
```

---

### 7. Deployment Demonstration (1-2 minutes)

**Screen**: Terminal and deployment script

**Script**:
> "Now let's deploy the contract. I'll start a local Hardhat node and deploy to it."

**Commands**:
```bash
# Terminal 1: Start local node
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.ts --network localhost
```

**Show**:
- Deployment script output
- Contract address
- Initial configuration values

**Script**:
> "The deployment script shows the contract address, initial period number, and alert thresholds. In production, you'd deploy to Zama's Sepolia testnet."

---

### 8. Frontend Interaction (2 minutes)

**Screen**: Web browser with frontend interface

**Script**:
> "The project includes a complete web interface. Let me start the local server and demonstrate the user experience."

**Commands**:
```bash
npm run dev
```

**Browser actions**:

1. **Show initial state**:
   - "Here's the interface - notice the connection status and period information."

2. **Connect MetaMask**:
   - Click "Connect Wallet"
   - "I'm connecting with MetaMask to interact with the contract."

3. **Show Health Authority View** (if connected as deployer):
   - "As the health authority, I have access to administrative functions."
   - Click "Start New Period"
   - Show period status updating

4. **Show Reporter View**:
   - Switch to different account or show reporter form
   - "Authorized reporters can submit anonymous health data."
   - Select symptom score: 5 (Moderate symptoms)
   - Select exposure level: 2 (Brief contact)
   - Click "Submit Anonymous Report"
   - Show transaction confirmation

5. **Show Period Status**:
   - "The interface updates in real-time showing participant count and time remaining."
   - Show progress bar animation

6. **Show Event Log**:
   - "All contract events appear in this log for transparency."
   - Scroll through events

---

### 9. Key Features Recap (1 minute)

**Screen**: Back to README or slides

**Script**:
> "Let me recap the key features demonstrated:
>
> One - Privacy-preserving health reporting with encrypted symptom scores and exposure levels
>
> Two - Role-based access control with health authority and authorized reporters
>
> Three - Time-based reporting periods with 24-hour windows
>
> Four - Encrypted data aggregation without revealing individual contributions
>
> Five - Alert thresholds for epidemic detection based on aggregated data
>
> Six - Complete test coverage demonstrating FHEVM patterns and edge cases"

**Show**:
- Feature list on screen
- Code statistics (if available)

---

### 10. FHEVM Concepts Summary (1 minute)

**Screen**: FHEVM concepts table from README

**Script**:
> "This project implements core FHEVM patterns that developers can learn from:
>
> Encrypted types like euint8 and euint16 for storing sensitive data
>
> FHE arithmetic operations for aggregation without decryption
>
> Granular access control using FHE.allow and FHE.allowThis
>
> Public decryption for aggregated statistics
>
> And user decryption for individual data retrieval
>
> All of these patterns are fully tested and documented for developers to reference."

**Show**:
- FHEVM concepts table from README
- Links to test files
- Documentation annotations

---

### 11. Real-World Applications (30 seconds)

**Screen**: Use cases or future enhancements

**Script**:
> "This pattern extends beyond epidemic tracking. Similar approaches could secure:
>
> - Mental health self-assessments
> - Workplace safety incident reporting
> - Clinical trial data collection
> - Public health surveys
>
> Any scenario requiring aggregated insights while preserving individual privacy."

---

### 12. Closing (30 seconds)

**Screen**: Project repository or summary slide

**Script**:
> "Thank you for watching this demonstration of the Anonymous Epidemic Tracker. This project showcases how FHEVM enables privacy-preserving applications that were previously impossible. The complete code, tests, and documentation are available in the repository. This submission was created for the Zama Bounty Program December 2025 challenge."

**Show**:
- GitHub repository URL (or project location)
- Contact information (if applicable)
- "Thank you" slide

---

## Technical Requirements for Video

### Recording Setup
- **Screen Resolution**: 1920x1080 (1080p) minimum
- **Frame Rate**: 30 fps minimum
- **Audio**: Clear narration with minimal background noise
- **Software**: OBS Studio, Camtasia, or similar screen recording software

### Recording Tips
1. **Close unnecessary applications** to reduce distractions
2. **Increase terminal font size** for readability (16pt+)
3. **Use syntax highlighting** in code editor
4. **Zoom in on important code sections**
5. **Pause between sections** for easier editing
6. **Record in segments** if needed, then edit together

### Editing Checklist
- [ ] Add title slide with project name
- [ ] Add section transitions
- [ ] Highlight mouse cursor during important clicks
- [ ] Add text overlays for key concepts (optional)
- [ ] Include terminal output clearly visible
- [ ] Ensure audio levels are consistent
- [ ] Add closed captions (recommended)
- [ ] Export in high quality (1080p, H.264)

---

## Quick Reference Commands

### One-Time Setup
```bash
npm install
npm run compile
```

### For Each Demo
```bash
# Terminal 1: Local node
npx hardhat node

# Terminal 2: Deploy
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: Frontend
npm run dev
```

### Testing Commands
```bash
npm test                    # Run all tests
npm run test:coverage      # Show coverage report
npm run compile            # Compile contracts
npm run clean              # Clean build artifacts
```

---

## Common Demo Pitfalls to Avoid

1. **Don't rush through code sections** - give viewers time to read
2. **Don't assume FHEVM knowledge** - explain concepts clearly
3. **Don't skip test results** - they validate correctness
4. **Don't forget to show the frontend** - it demonstrates real usage
5. **Don't neglect audio quality** - bad audio ruins good content

---

## Alternative Demo Formats

### Short Version (3-5 minutes)
Focus on:
1. Introduction (30s)
2. Problem statement (30s)
3. Contract highlights (1m)
4. Test run (1m)
5. Frontend demo (1-2m)
6. Closing (30s)

### Extended Version (15-20 minutes)
Add:
1. Detailed code walkthrough
2. Step-by-step test analysis
3. Deployment to testnet
4. Multiple user scenarios
5. Security considerations discussion
6. Future enhancements

---

## Submission Checklist

Before submitting your video:
- [ ] Video clearly shows project setup
- [ ] Key FHEVM concepts are explained
- [ ] Code is clearly visible and explained
- [ ] Tests are shown passing
- [ ] Deployment is demonstrated
- [ ] Frontend interaction is shown
- [ ] Audio is clear and audible
- [ ] Video length is appropriate (5-10 minutes recommended)
- [ ] Video is uploaded to YouTube/Vimeo/platform
- [ ] Video link is included in submission

---

## Additional Resources

- **FHEVM Documentation**: https://docs.zama.ai/fhevm
- **Zama GitHub**: https://github.com/zama-ai
- **Example Videos**: Search for "Zama FHEVM" on YouTube for reference
- **Bounty Requirements**: Review the original bounty document

---

**Good luck with your demonstration video!**

Remember: The goal is to clearly communicate how FHEVM enables privacy-preserving applications while being accessible to developers who are new to the technology.
