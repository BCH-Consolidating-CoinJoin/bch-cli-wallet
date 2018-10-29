/*
  Utility Library.
  Common functions used by several commands.
*/

"use strict"

const fs = require("fs")

module.exports = {
  saveWallet,
  openWallet,
  changeAddrFromMnemonic
}

// Wrap the file save stuff in a Promise.
function saveWallet(name, walletData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      `./wallets/${name}.json`,
      JSON.stringify(walletData, null, 2),
      function(err) {
        if (err) return reject(console.error(err))

        //console.log(`${name}.json written successfully.`)
        return resolve()
      }
    )
  })
}

// Open a wallet by file name.
function openWallet(name) {
  try {
    // Delete the cached copy of the wallet. This allows testing of list-wallets.
    //delete require.cache[require.resolve(`../../${thisFile}`)]

    const walletInfo = require(`../wallets/${name}.json`)
    return walletInfo
  } catch (err) {
    throw new Error(`Could not open ${name}.json`)
  }
}

// Generate a change address from a Mnemonic of a private key.
function changeAddrFromMnemonic(mnemonic, index, BITBOX) {
  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)

  // master HDNode
  const masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, "testnet")

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

  // derive the first external change address HDNode which is going to spend utxo
  const change = BITBOX.HDNode.derivePath(account, `0/${index}`)

  return change
}
