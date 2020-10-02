import React from 'react'

const { REACT_APP_UI_STYLES } = process.env

export default ({ reverse, executeSignatures, networkName }) => (
  <div className="transfer-alert">
    <div className="alert-container">
      <div className={`transfer-title-alternative transfer-title-alternative-${REACT_APP_UI_STYLES}`}>
        <span className="transfer-title-text">Claim Your Tokens</span>
      </div>
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {reverse ? (
          <div className="transfer-buttons">
            <button onClick={executeSignatures} className="transfer-confirm" style={{ width: 100 }}>
              Claim
            </button>
          </div>
        ) : (
          <p className="transfer-description" data-testid="transfer-description">
            Please switch the network in your wallet to <strong>{networkName}</strong>
          </p>
        )}
      </div>
    </div>
  </div>
)
