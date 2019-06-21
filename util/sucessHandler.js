const successMessage = {
    initialPurchase: "Sales order data successfully requested to blockchain. Waiting for validating nodes to add the information to ledger",
    initialPurchaseAffiliate: "Sales order and affiliate data successfully requested to blockchain. Waiting for validating nodes to add the information to ledger",
    payoutProcess: "",
    sendRawTxn : "Contract's function called",
    putCommission : "Successfully written commision for.",
    payoutComplete : "payout successful"

}

const successHandler = {

    post: (message, data) => {
        return {
            code: 200,
            status: 'SUCCESS',
            message: message || "Creation successful",
            data: data || null
        }
    },

    get: (data) => {
        return {
            code: 200,
            status: 'SUCCESS',
            data: data || null
        }
    }

};

module.exports = {
    successMessage,
    successHandler
}