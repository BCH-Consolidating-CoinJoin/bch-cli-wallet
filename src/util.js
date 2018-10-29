/*
  Utility Library.
  Common functions used by several commands.
*/

"use strict"

const fs = require("fs")

module.exports = {
  saveWallet,
  openWallet
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
