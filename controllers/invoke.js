const router = require("express").Router();


const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');



const invoke = async (req, res) => {
    try {

         // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {
            console.log('An identity for the user "user1" does not exist in the wallet');
            console.log('Run the registerUser.js application before retrying');
            return res.status(500).send("An identity for the user does not exist in the wallet")
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        const contract = network.getContract('service-req-handler');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        await contract.submitTransaction('requestQueryData',
        req.body.NationalID,
        req.body.Firstname,
        req.body.Lastname,
        req.body.Address,
        req.body.DOB,
        "",
        req.body.OrganizationID
        );

        res.status(200).send("Transaction has been submitted")

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {

        return res.status(500).send("Failed to submit transaction")
    }
}

router.post('/invoke', invoke)
module.exports = router;