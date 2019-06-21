const errorMessage = {
    initialPurchase: "Pucharse failure",
      initialPurchaseAffiliate: "Purchase failure with affiliate",
      getCommissionId: "Get commision failure",
      putCommission: "Put commision failure",
      payoutCommisionFromContract: "Commision failure",
      payoutCommissionFromTafiliate: "Commision failure",
      payoutComplete: "poyout couldnot complete",
      call: "issue while calling contract",
      sendRawTxn: "issue while writing data to blockchain.",
      approvedComission: "Error while commission approve"
  }

  const errorHandler = {
      validationError: (message, data) => {

          return {
              code: 422,
              status: 'ERROR',
              message: message || 'Validation error',
              data: data || null
          }

      },

      badRequest: (message) => {
          return {
              code: 400,
              status: 'ERROR',
              message: message || 'Bad request'
          }
      },

      server: (message, e) => {

          return new Promise((resolve, reject) => {
              if (e.status === 'ERROR') {
                  reject(e)

              } else {
                  console.error(e);
                  reject({
                      code: 500,
                      status: 'ERROR',
                      message: message || 'Internal server error'
                  })

              }
          })
      },

      authentication: (message) => {
          return {
              code: 401,
              status: 'ERROR',
              message: message || 'Authentication error'
          }
      },

      foridden: (message) => {
          return {
              code: 403,
              status: 'ERROR',
              message: message || 'Forbidden'
          }
      }


  }
  module.exports = {
      errorMessage,
      errorHandler
  }