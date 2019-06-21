const router = require("express").Router();

const FabricCAServices = require('fabric-ca-client');
const {
    FileSystemWallet,
    X509WalletMixin
} = require('fabric-network');
const fs = require('fs');
const path = require('path');

const ccpPath = path.resolve(`${__dirname}/../config/connection.json`);
const ccpJSON = fs.readFileSync(ccpPath, 'utf8');
const ccp = JSON.parse(ccpJSON);

const enrollAdmin = async (req, res) => {
    try {
        console.log("starting")
        // Create a new CA client for interacting with the CA.
        const caURL = ccp.certificateAuthorities['ca.org1.example.com'].url;
        const ca = new FabricCAServices(caURL);

        // Create a new file system based wallet for managing identities.
        const walletPath = path.join(process.cwd(), 'wallet');
        const wallet = new FileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the admin user.
        const adminExists = await wallet.exists('admin');
        if (adminExists) {
            return res.status(400).send('An identity for the admin user "admin" already exists in the wallet')
        }

        // Enroll the admin user, and import the new identity into the wallet.
        const enrollment = await ca.enroll({
            enrollmentID: 'admin',
            enrollmentSecret: 'adminpw'
        });
        const identity = X509WalletMixin.createIdentity('Org1MSP', enrollment.certificate, enrollment.key.toBytes());
        wallet.import('admin', identity);
        return res.status(200).send('Successfully enrolled admin user "admin" and imported it into the wallet')

    } catch (e) {
        return res.status(500).send(e)
    }
}



router.post('/enrollAdmin', enrollAdmin);

module.exports = router;