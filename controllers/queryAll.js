const router = require("express").Router();

const { FileSystemWallet, Gateway } = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');



const queryByOrg = async (req, res) => {


    try {
                const orgid = req.body.orgid
                const nameCapitalized = orgid.charAt(0).toUpperCase() + orgid.slice(1)
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
            //    const contract = network.getContract('billing');
       
               // Evaluate the specified transaction.
               // queryCar transaction - requires 1 argument, ex: ('queryCar', 'CAR4')
               // queryAllCars transaction - requires no arguments, ex: ('queryAllCars')
               const result = await contract.evaluateTransaction('receiveBillingByAccount',nameCapitalized);
            //    const result = await contract.evaluateTransaction('getBillingByOrg',nameCapitalized);

        return res.status(200).send(JSON.parse(result));

    } catch (error) {

        return res.status(500).send("Failed to evaluate transaction")
    }


}




router.post('/queryByOrg', queryByOrg)
module.exports = router;