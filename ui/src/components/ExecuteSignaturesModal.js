import React from 'react'
import { InfoIcon } from './icons/Info'

export default class extends React.Component {
  state = {
    txHash: ''
  }

  handleInputChange = event => {
    this.setState({
      txHash: event.target.value
    })
  }

  handleExecuteSignatures = async () => {
    try {
      await this.props.executeSignatures()
      this.props.setError(null)
    } catch (error) {
      console.log(error)
      this.props.setError(error.message)
    }
  }

  handleSubmitTx = async txHash => {
    try {
      await this.props.getSignatures(txHash)
      this.handleExecuteSignatures()
      this.props.setError(null)
    } catch (error) {
      console.log(error)
      this.props.setError(error.message)
    }
  }

  render() {
    const {
      isOnTheRightNetwork,
      foreignNetworkName,
      withInput,
      error,
      account,
      unexecutedTransactions,
      currency
    } = this.props
    const unexecutedTransactionsOfUser = unexecutedTransactions.filter(
      tx => tx.recipient.toLowerCase() === account.toLowerCase()
    )
    return (
      <div className="execute-signatures-modal">
        <div className="execute-signatures-modal-container">
          <div className="execute-signatures-title">
            <span className="execute-signatures-title-text">Claim Your Tokens</span>
          </div>
          {isOnTheRightNetwork ? (
            <>
              {withInput ? (
                unexecutedTransactionsOfUser.length > 0 ? (
                  <>
                    <div className="execute-signatures-transactions-list-container">
                      <div className="execute-signatures-transactions-list">
                        {unexecutedTransactionsOfUser.map(tx => (
                          <div key={tx.transactionHash} className="execute-signatures-transactions-list-item">
                            <span className="execute-signatures-transactions-list-item-hash">
                              {`${tx.transactionHash.substring(0, 6)}..${tx.transactionHash.substring(62)}`}
                            </span>
                            <span className="execute-signatures-transactions-list-item-value">
                              {`${tx.value} ${currency}`}
                            </span>
                            <a
                              className="execute-signatures-transactions-list-item-claim-button"
                              onClick={() => this.handleSubmitTx(tx.transactionHash)}
                            >
                              Claim
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                    {error && <span className="execute-signatures-error">{error}</span>}
                  </>
                ) : (
                  <div className="execute-signatures-content-container">
                    <span className="execute-signatures-info-text">
                      You don't have tokens to claim. <br />
                      If you have any questions please contact us on social networks.
                    </span>
                  </div>
                )
              ) : (
                <div className="execute-signatures-content-container">
                  <button onClick={this.handleExecuteSignatures} className="execute-signatures-confirm">
                    Claim
                  </button>
                  {error && <span className="execute-signatures-error">{error}</span>}
                  <p className="execute-signatures-info-text">
                    <InfoIcon />
                    The claim process may take a variable period of time on {foreignNetworkName} depending on network{' '}
                    congestion. Your {currency} balance will increase to reflect the completed transfer after the claim{' '}
                    is processed.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="execute-signatures-content-container">
              <p className="execute-signatures-switch-network-text">
                Please switch the network in your wallet to <strong>{foreignNetworkName}</strong>
              </p>
              {!withInput && (
                <p className="execute-signatures-info-text">
                  <InfoIcon />
                  After you switch networks, you will complete a second transaction on {foreignNetworkName} to claim{' '}
                  your {currency} tokens.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }
}
