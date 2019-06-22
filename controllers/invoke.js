const router = require("express").Router();
const {
    check,
    validationResult
} = require('express-validator');

const {
    FileSystemWallet,
    Gateway
} = require('fabric-network');
const path = require('path');

const ccpPath = path.resolve(__dirname, '..', '..', 'first-network', 'connection-org1.json');



const invoke = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({
                errors: errors.array()
            });
        }
        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        const userExists = await wallet.exists('user1');
        if (!userExists) {

            return res.status(400).send('An identity for the user "user1" does not exist in the wallet. registerUser before retrying')
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccpPath, {
            wallet,
            identity: 'user1',
            discovery: {
                enabled: false
            }
        });

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork('mychannel');

        // Get the contract from the network.
        // const contract = network.getContract('service-req-handler');
        const contract = network.getContract('service-req-handler');

        // Submit the specified transaction.
        // createCar transaction - requires 5 argument, ex: ('createCar', 'CAR12', 'Honda', 'Accord', 'Black', 'Tom')
        // changeCarOwner transaction - requires 2 args , ex: ('changeCarOwner', 'CAR10', 'Dave')
        const response = await contract.submitTransaction('requestQueryData', req.body.NationalID, req.body.Firstname, req.body.Lastname, req.body.DOB, req.body.Address, req.body.Image, req.body.Orgid);
        const aggregate = response.FinalResponse
        const r = JSON.parse(response)

        var result = []
        var obj = r.FinalResponse
        for (var key in obj) {
            // Image is not shown in phase one
            if (key === 'Image') {
                continue
            }
            if (obj.hasOwnProperty(key)) {
                result.push({
                    Label: key,
                    Result: obj[key],
                    Confidence: aggregate.qaMetrics[key]
                })
            }
        }
        res.status(200).send(result);

        // Disconnect from the gateway.
        await gateway.disconnect();

    } catch (error) {

        return res.status(500).send(`Failed to submit transaction: ${error}`)
    }
}





router.post('/invoke', [
    check("NationalID").exists().withMessage("Field Required").isLength({
        min: 9,
        max: 12
    }).withMessage('Length of NID is either 9 or 12'),
    check("Firstname").exists().withMessage("Field Required").isLength({
        min: 1,
        max: 50
    }).withMessage('Shouldn\'t not exceed 50 character').isAlpha().withMessage("It should accept character only."),
    check("Lastname").exists().withMessage("Field Required").isLength({
        min: 1,
        max: 50
    }).withMessage('Shouldn\'t not exceed 50 character').isAlpha().withMessage("It should accept character only."),
    check("Address").exists().withMessage("Field Required").isLength({
        min: 1,
        max: 50
    }).withMessage('Shouldn\'t not exceed 50 character'),
    check("DOB").exists().withMessage("Field Required").custom(value => {
        const dateReg = /^\d{4}[.-]\d{2}[.-]\d{2}$/
        if (!value.match(dateReg)) {
            throw new Error('Date format should be yyyy-mm-dd');
        }
        var timestamp = Date.parse(value);
        if (!isNaN(timestamp) == false) {
            throw new Error('Date is invalid')
        }
        var mydate = new Date(timestamp);
        const now = new Date()
        if (mydate > now) {
            throw new Error('Date shouldn\'t be above current date')
        }
        // Indicates the success of this synchronous custom validator
        return true;
    }),
    check("Image").exists().withMessage("Field Required"),
    check("OrgId").exists().withMessage("Field Required").isLength({
        min: 1,
        max: 50
    }).withMessage('Shouldn\'t not exceed 50 character'),
], invoke)
module.exports = router;