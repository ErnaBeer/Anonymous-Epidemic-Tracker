# Development Guide - Anonymous Epidemic Tracker

This guide provides detailed information for developers working on or extending the Anonymous Epidemic Tracker project.

## Project Overview

The Anonymous Epidemic Tracker is an FHEVM example demonstrating privacy-preserving health monitoring. It serves as an educational resource for developers learning FHEVM concepts while providing a functional epidemic tracking system.

## Development Environment Setup

### Prerequisites
- Node.js 16+ (we recommend Node.js 18 LTS)
- npm 8+
- Git
- Text editor or IDE (VS Code recommended)
- MetaMask browser extension (for frontend testing)

### Initial Setup

```bash
# Clone or download the repository
cd anonymous-epidemic-tracker

# Install dependencies
npm install

# Create .env file (see .env.example)
cp .env.example .env
# Edit .env with your settings
```

## Project Structure Details

```
anonymous-epidemic-tracker/
├── contracts/
│   └── AnonymousEpidemicTracker.sol     # Main FHEVM contract (296 lines)
├── test/
│   └── AnonymousEpidemicTracker.test.ts # 25+ test cases with @chapter tags
├── scripts/
│   └── deploy.ts                        # TypeScript deployment script
├── hardhat.config.ts                    # Hardhat configuration
├── tsconfig.json                        # TypeScript configuration
├── package.json                         # Dependencies and scripts
├── index.html                           # Web UI (1042 lines, standalone)
├── public.json                          # Schema definition
├── vercel.json                          # Deployment configuration
├── README.md                            # User documentation
├── DEVELOPMENT.md                       # This file
├── DEMO-VIDEO-SCRIPT.md                 # Video demonstration guide
└── .env.example                         # Environment template
```

## Contract Architecture

### Main Components

1. **HealthReport Structure**
   - Stores encrypted individual health data
   - Per-reporter, per-period basis
   - Includes non-encrypted metadata (timestamp, reported flag)

2. **EpidemicPeriod Structure**
   - Aggregates encrypted data for each period
   - Tracks participation and timeline
   - Maintains reporter list for audit

3. **Role-Based Access Control**
   - Health Authority: Contract deployment address
   - Authorized Reporters: Approved health data submitters
   - Public: Can query non-sensitive period information

4. **Encrypted Data Management**
   - `euint8` for individual scores (0-255 range)
   - `euint16` for aggregated sums (0-65535 range)
   - Encryption handled via FHE.asEuint8/16 functions

### Key Functions by Category

#### Period Lifecycle
```
startNewPeriod()
├── Initializes encrypted counters
├── Sets period active flag
└── Emits PeriodStarted event

analyzePeriod()
├── Validates period duration elapsed
├── Requests decryption of aggregates
└── Triggers processAnalysis callback

processAnalysis()
├── Receives decrypted aggregates
├── Evaluates against thresholds
├── Emits alerts
└── Advances to next period

emergencyEndPeriod()
├── Force-ends current period
└── Advances period counter
```

#### Data Operations
```
submitHealthReport()
├── Validates authorization
├── Encrypts scores
├── Grants access permissions
├── Aggregates via FHE.add()
└── Emits report event

authorizeReporter() / revokeReporter()
├── Health authority only
└── Updates reporter whitelist

updateThresholds()
├── Health authority only
├── Adjusts alert sensitivity
└── Affects future analysis
```

#### Query Functions
```
getCurrentPeriodInfo()           (View)
hasUserReported()               (View)
getPeriodHistory()              (View)
isPeriodActive()                (View)
shouldAnalyzePeriod()           (View)
```

## Testing Strategy

### Test Organization

Tests are organized by @chapter tags matching FHEVM concepts:

```
@chapter: access-control          - Permission enforcement
@chapter: user-decryption         - Individual data access
@chapter: public-decryption       - Aggregate data access
@chapter: encrypted-arithmetic    - FHE operations
@chapter: input-proof            - Validation patterns
@chapter: contract-deployment    - Initialization
```

### Test Categories

1. **Initialization Tests** (4 tests)
   - Contract setup
   - Initial state verification
   - Default configuration

2. **Access Control Tests** (4 tests)
   - Role-based permissions
   - Authorization/revocation
   - Unauthorized access rejection

3. **Period Management Tests** (4 tests)
   - Period transitions
   - State validation
   - Duration handling

4. **Health Report Submission Tests** (6 tests)
   - Authorized submission
   - Duplicate prevention
   - Range validation
   - Multiple reporters
   - Time constraints

5. **Threshold Management Tests** (2 tests)
   - Configuration updates
   - Permission checks

6. **User Query Functions Tests** (2 tests)
   - Data retrieval
   - Access validation

7. **Edge Cases Tests** (3 tests)
   - Zero values
   - Boundary values
   - Initial conditions

8. **Period Transition Tests** (2 tests)
   - Counter management
   - Multi-period lifecycle

### Running Tests

```bash
# Run all tests with default reporter
npm test

# Run with verbose output
npm test -- --reporter spec

# Run specific test file
npx hardhat test test/AnonymousEpidemicTracker.test.ts

# Run specific test by name pattern
npx hardhat test --grep "Access Control"

# Show gas usage
npm test -- --reporter json > test-results.json

# Generate coverage report
npm run test:coverage
```

### Adding New Tests

When adding tests, follow this structure:

```typescript
/**
 * Test: Clear description of what is tested
 * Demonstrates: Which FHEVM concept or pattern
 * chapter: fhevm-concept
 */
it("should do something specific", async function () {
    // Arrange - set up preconditions
    const setup = ... ;

    // Act - perform the action
    const result = ... ;

    // Assert - verify outcomes
    expect(result).to.equal(...);
});
```

## Frontend Development

### Architecture

The `index.html` is a standalone single-page application with:
- Inline CSS styling (responsive, gradient-based design)
- Inline JavaScript using ethers.js v5
- No build step required
- Works directly in browsers with MetaMask

### Key Components

1. **Network Status Indicator**
   - Top-right corner
   - Shows MetaMask connection state
   - Auto-updates on network changes

2. **Connection Card**
   - MetaMask wallet connection
   - Account information display
   - Role detection (authority vs. reporter)

3. **Period Status Card**
   - Real-time period information
   - Progress bar visualization
   - Auto-refresh every 30 seconds

4. **Health Report Card**
   - Symptom and exposure level selectors
   - Report submission form
   - Submission status feedback

5. **Health Authority Card**
   - Hidden unless user is authority
   - Period management controls
   - Reporter authorization
   - Threshold configuration

6. **Event Log**
   - Real-time contract event monitoring
   - Color-coded message types
   - Scrollable with clear button

### Updating Contract Address

The frontend requires contract address and ABI updates:

```javascript
// Line 448-449 in index.html
const CONTRACT_ADDRESS = '0x...'  // Update with deployed address
const CONTRACT_ABI = [ ... ]      // Matches current contract functions
```

### Adding New UI Elements

To add a new feature:
1. Add HTML markup in appropriate card or create new card
2. Add CSS styling following existing patterns
3. Add JavaScript function
4. Call function from button onclick or event listener

Example:
```javascript
async function newFeature() {
    try {
        addToEventLog('⚙️ Performing action...', 'info');
        const tx = await contract.contractFunction();
        addToEventLog('⏳ Transaction submitted: ' + tx.hash, 'info');

        const receipt = await tx.wait();
        addToEventLog('✅ Action completed!', 'success');

        // Refresh UI
        await loadPeriodStatus();
    } catch (error) {
        addToEventLog(`❌ Error: ${error.message}`, 'danger');
    }
}
```

## Deployment

### Local Development

```bash
# Terminal 1: Start Hardhat node
npx hardhat node

# Terminal 2: Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost

# Terminal 3: Start frontend
npm run dev
```

### Zama Sepolia Testnet

```bash
# Set up .env with Sepolia RPC and private key
# Then deploy:
npx hardhat run scripts/deploy.ts --network sepolia

# Verify deployment:
# - Check address on Sepolia block explorer
# - Confirm transaction was included
# - Note the contract address for frontend
```

### Production Considerations

Before production deployment:
1. **Security Audit**: Have contract reviewed by security professionals
2. **Testing**: Thorough testing on testnet including multiple scenarios
3. **Documentation**: Update deployment instructions
4. **Monitoring**: Set up event monitoring and alerting
5. **Governance**: Define processes for threshold updates and period management

## Code Standards

### Solidity Style Guide

- Use clear, descriptive variable names
- Document functions with comments explaining FHEVM operations
- Organize functions by visibility: public, external, internal, private
- Group related functions together

### TypeScript/JavaScript Style Guide

- Use async/await for promise handling
- Add try/catch blocks for user-facing operations
- Use descriptive function and variable names
- Comment non-obvious logic
- Include JSDoc comments for exported functions

### Documentation Standards

- Include @chapter tags for test functions
- Document FHEVM concepts used
- Explain access control requirements
- Provide usage examples

## Common Development Tasks

### Adding a New Health Authority Function

1. Write function in contract:
```solidity
/**
 * @dev New authority function
 * Demonstrates: FHEVM concept
 */
function newFunction() external onlyHealthAuthority {
    // Implementation
    emit EventName(...);
}
```

2. Add event definition:
```solidity
event EventName(indexed uint8 period, ...);
```

3. Add tests:
```typescript
it("should call new function", async function () {
    const ownerContract = contract.connect(owner);
    await expect(ownerContract.newFunction())
        .to.emit(contract, "EventName");
});
```

4. Update frontend if needed:
```javascript
async function callNewFunction() {
    try {
        const tx = await contract.newFunction();
        await tx.wait();
        addToEventLog("✅ Function called successfully", "success");
    } catch (error) {
        addToEventLog(`❌ Error: ${error.message}`, "danger");
    }
}
```

### Modifying Data Structures

1. Update struct in contract
2. Update any related functions that access the struct
3. Add/update tests for new fields
4. Document new fields in README
5. Update frontend queries if needed

### Adding Input Validation

1. Add requirement checks in function:
```solidity
require(condition, "Error message");
```

2. Add test case:
```typescript
it("should validate input", async function () {
    await expect(
        contract.functionWithValidation(invalidValue)
    ).to.be.revertedWith("Error message");
});
```

## Debugging

### Contract Debugging

```bash
# Print contract state
npx hardhat console --network localhost
> const contract = await ethers.getContractAt("AnonymousEpidemicTracker", "0x...");
> const period = await contract.currentPeriod();
> period.toString()

# View transaction details
> const tx = await ethers.provider.getTransaction("0x...");
> console.log(tx);
```

### Test Debugging

```bash
# Run single test with logs
npx hardhat test test/AnonymousEpidemicTracker.test.ts --grep "test name"

# Add console.log to tests
// In test file:
console.log("Debug info:", variable);
```

### Frontend Debugging

```javascript
// Open browser Developer Tools (F12)
// Inspect network calls
// Check Console for JavaScript errors
// Use Sources tab to set breakpoints

// Add logging
console.log("Debug:", variable);
```

## Performance Considerations

### Gas Optimization

- Batch operations when possible
- Minimize state changes
- Use appropriate data types
- Consider encrypted computation overhead

### Frontend Performance

- Cache contract ABI to reduce file size
- Minimize event listener chaining
- Debounce frequent updates
- Use efficient DOM selectors

## Security Considerations

### Contract Security

- Always validate inputs
- Use proper access control modifiers
- Check for reentrancy issues
- Audit encrypted operations

### Frontend Security

- Validate all user inputs
- Don't expose sensitive data in frontend code
- Use secure RPC endpoints
- Implement rate limiting

### FHEVM-Specific

- Understand encrypted value lifecycle
- Grant permissions carefully with FHE.allow
- Validate that contract has FHE.allowThis access
- Consider decryption privacy implications

## Contributing Guidelines

### Making Changes

1. Create feature branch from main
2. Make focused changes
3. Add tests for new functionality
4. Update documentation
5. Submit for review

### Commit Messages

```
feat: Add new feature description
fix: Fix bug description
docs: Update documentation
test: Add test cases
refactor: Refactor code section
```

### Code Review Checklist

- [ ] Code follows style guidelines
- [ ] Tests added and passing
- [ ] Documentation updated
- [ ] No security issues
- [ ] FHEVM concepts properly used
- [ ] Gas efficiency considered

## Troubleshooting

### Common Issues

#### "Contract not found" on network
- Verify contract address is correct
- Check network configuration
- Ensure contract is deployed to connected network

#### Tests failing with "Unknown error"
- Check FHEVM environment setup
- Verify contract compiles
- Clear cache: `npm run clean && npm install`

#### Frontend can't connect to contract
- Verify CONTRACT_ADDRESS in index.html
- Check MetaMask is on correct network
- Confirm contract ABI matches deployed contract

#### Gas estimation errors
- Contract might have state issues
- Try resetting local node
- Check input parameters are valid

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/)
- [FHEVM Docs](https://docs.zama.ai/fhevm)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Solidity Documentation](https://docs.soliditylang.org/)

## Getting Help

If you encounter issues:
1. Check this development guide
2. Review README.md and code comments
3. Check test cases for usage patterns
4. Review FHEVM documentation
5. Open an issue with detailed reproduction steps

---

**Happy developing! 🚀**
