import React from 'react'
import { InfoIcon } from './icons/Info'

export default class extends React.Component {
  state = {
    txHash: '',
    showInput: false
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

  toggleShowInput = () => {
    this.setState({ showInput: !this.state.showInput })
    this.props.setError(null)
  }

  render() {
    const { isOnTheRightNetwork, foreignNetworkName, withTxsList, error, unexecutedTransactions, currency } = this.props
    return (
      <div className="execute-signatures-modal">
        <div className="execute-signatures-modal-container">
          <div className="execute-signatures-title">
            <span className="execute-signatures-title-text">Claim Your Tokens</span>
            {withTxsList &&
              isOnTheRightNetwork && (
                <a className="execute-signatures-switch-to-input" onClick={this.toggleShowInput}>
                  {this.state.showInput ? 'Show list of transactions' : 'Enter transaction hash manually'}
                </a>
              )}
          </div>
          {isOnTheRightNetwork ? (
            <>
              {withTxsList ? (
                <>
                  {this.state.showInput ? (
                    <div className="execute-signatures-content-with-input">
                      <span className="execute-signatures-input-description">
                        Specify the transaction hash where xDai transfer happened or relayTokens method was called.{' '}
                        <a
                          href="https://www.xdaichain.com/for-users/converting-xdai-via-bridge/find-a-transaction-hash"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          How to find the transaction hash?
                        </a>
                      </span>
                      <div className="execute-signatures-form">
                        <div className="execute-signatures-form-input-container">
                          <input
                            onChange={this.handleInputChange}
                            type="text"
                            className="execute-signatures-form-input"
                            placeholder="Transaction hash..."
                          />
                        </div>
                        <div>
                          <button
                            className="execute-signatures-form-button"
                            onClick={() => this.handleSubmitTx(this.state.txHash)}
                          >
                            Claim
                          </button>
                        </div>
                        {error && <span className="execute-signatures-input-error">{error}</span>}
                      </div>
                    </div>
                  ) : (
                    <>
                      {unexecutedTransactions.length > 0 ? (
                        <>
                          <div className="execute-signatures-transactions-list-container">
                            <div className="execute-signatures-transactions-list">
                              {unexecutedTransactions.map(tx => (
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
                      )}
                    </>
                  )}
                </>
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
              {!withTxsList && (
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
