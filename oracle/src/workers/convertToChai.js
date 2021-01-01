require('../../env')
const { HttpListProviderError } = require('../services/HttpListProvider')
const rootLogger = require('../services/logger')
const { getValidatorContract } = require('../tx/web3')

function convertToChaiBuilder(config) {
  const { bridgeContract, web3 } = config.foreign

  let validatorContract = null

  return async function convertToChai(blockNumber) {
    const txToSend = []

    const logger = rootLogger.child({
      blockNumber: blockNumber.toString()
    })

    logger.debug(`Starting convert to chai operation`)

    if (validatorContract === null) {
      validatorContract = await getValidatorContract(bridgeContract, web3)
    }

    logger.debug(`Checking if is validator duty`)
    const validatorDuty = await validatorContract.methods.isValidatorDuty(config.validatorAddress).call()

    if (!validatorDuty) {
      logger.info(`Convert to chai discarded because is not validator duty`)
      return txToSend
    }

    logger.debug(`Checking if dai token balance is above the threshold`)
    const daiNeedsToBeInvested = await bridgeContract.methods.isDaiNeedsToBeInvested().call()

    if (!daiNeedsToBeInvested) {
      logger.info(`Convert to chai discarded because dai balance is below the threshold or chai token is not set`)
      return txToSend
    }

    let gasEstimate

    try {
      logger.debug(`Estimate gas`)
      gasEstimate = await bridgeContract.methods.convertDaiToChai().estimateGas({
        from: config.validatorAddress
      })

      logger.debug({ gasEstimate }, 'Gas estimated')
    } catch (e) {
      if (e instanceof HttpListProviderError) {
        const errorMsg = 'RPC Connection Error: convertToChai Gas Estimate cannot be obtained.'
        logger.error(e, errorMsg)
        throw new Error(errorMsg)
      } else {
        logger.error(e, 'Unknown error while processing transaction')
        throw e
      }
    }

    // generate data
    const data = bridgeContract.methods.convertDaiToChai().encodeABI()
    // push to job
    txToSend.push({
      data,
      gasEstimate,
      transactionReference: `convert to chai operation for block number ${blockNumber.toString()}`,
      to: config.foreign.bridgeAddress
    })

    return txToSend
  }
}

module.exports = convertToChaiBuilder
