import { ethers } from "hardhat";

/**
 * Deployment script for Anonymous Epidemic Tracker
 *
 * This script deploys the FHEVM-based epidemic tracking contract
 * and performs initial setup tasks.
 */
async function main() {
    console.log("Starting deployment of Anonymous Epidemic Tracker...\n");

    // Get the deployer account
    const [deployer] = await ethers.getSigners();
    console.log("Deploying with account:", deployer.address);

    const balance = await deployer.getBalance();
    console.log("Account balance:", ethers.utils.formatEther(balance), "ETH\n");

    // Deploy the contract
    const AnonymousEpidemicTracker = await ethers.getContractFactory("AnonymousEpidemicTracker");
    const contract = await AnonymousEpidemicTracker.deploy();

    await contract.deployed();

    console.log("✅ Anonymous Epidemic Tracker deployed to:", contract.address);
    console.log("✅ Health Authority (deployer):", deployer.address);

    // Initial configuration check
    const currentPeriod = await contract.currentPeriod();
    const symptomThreshold = await contract.symptomAlertThreshold();
    const exposureThreshold = await contract.exposureAlertThreshold();

    console.log("\n📊 Initial Configuration:");
    console.log("   Current Period:", currentPeriod.toString());
    console.log("   Symptom Alert Threshold:", symptomThreshold.toString());
    console.log("   Exposure Alert Threshold:", exposureThreshold.toString());

    console.log("\n🎉 Deployment complete!");
    console.log("\n📝 Contract address for frontend configuration:");
    console.log("   ", contract.address);

    console.log("\n📚 Next steps:");
    console.log("   1. Update frontend CONTRACT_ADDRESS with:", contract.address);
    console.log("   2. Run: await contract.startNewPeriod()");
    console.log("   3. Authorize reporters: await contract.authorizeReporter(address)");
    console.log("   4. Reporters can submit: await contract.submitHealthReport(symptomScore, exposureLevel)");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
