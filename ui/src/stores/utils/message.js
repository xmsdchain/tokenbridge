import { numberToHex, padLeft, toHex } from 'web3-utils'

function strip0x(input) {
  return input.replace(/^0x/, '')
}

export function createMessage({ recipient, value, transactionHash, bridgeAddress, expectedMessageLength }) {
  recipient = strip0x(recipient)

  value = numberToHex(value)
  value = padLeft(value, 32 * 2)

  value = strip0x(value)

  transactionHash = strip0x(transactionHash)

  bridgeAddress = strip0x(bridgeAddress)

  return `0x${recipient}${value}${transactionHash}${bridgeAddress}`
}

export function signatureToVRS(rawSignature) {
  const signature = strip0x(rawSignature)
  const v = signature.substr(64 * 2)
  const r = signature.substr(0, 32 * 2)
  const s = signature.substr(32 * 2, 32 * 2)
  return { v, r, s }
}

export function packSignatures(array) {
  const length = strip0x(toHex(array.length))
  const msgLength = length.length === 1 ? `0${length}` : length
  let v = ''
  let r = ''
  let s = ''
  array.forEach(e => {
    v = v.concat(e.v)
    r = r.concat(e.r)
    s = s.concat(e.s)
  })
  return `0x${msgLength}${v}${r}${s}`
}
