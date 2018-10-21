"use strict"

const fs = require("fs")
const BB = require("bitbox-sdk/lib/bitbox-sdk").default

const { Command, flags } = require("@oclif/command")

class CreateWallet extends Command {
  async run() {
    const { flags } = this.parse(CreateWallet)

    // Determine if this is a testnet wallet or a mainnet wallet.
    if (flags.testnet)
      var BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })
    else var BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

    this.createWallet(flags.testnet, flags.name, BITBOX)
  }

  async createWallet(testnet, name, BITBOX) {
    try {
      // Exit if a name is not supplied.
      if (!name || name === "") {
        this.log(`Please supply a name for the wallet with the -n argument.`)
        this.exit(1)
      }

      // Initialize the wallet data object that will be saved to a file.
      const walletData = {}
      if (testnet) walletData.network = "testnet"
      else walletData.network = "mainnet"

      // create 256 bit BIP39 mnemonic
      const mnemonic = BITBOX.Mnemonic.generate(
        256,
        BITBOX.Mnemonic.wordLists().english
      )
      walletData.mnemonic = mnemonic

      // root seed buffer
      const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)

      // master HDNode
      if (testnet)
        var masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, "testnet")
      else var masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

      // HDNode of BIP44 account
      const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

      // derive the first external change address HDNode which is going to spend utxo
      const change = BITBOX.HDNode.derivePath(account, "0/0")

      // get the cash address
      //walletData.address = BITBOX.HDNode.toCashAddress(change)

      // Initialize other data.
      walletData.balance = 0
      walletData.addressUsed = []
      walletData.hasBalance = []

      // Write out the basic information into a json file for other apps to use.
      await this.saveWallet(name, walletData)

      return walletData
    } catch (err) {
      if (err.code !== "EEXIT") console.log(`Error in createWallet().`)
      throw err
    }
  }

  // Wrap the file save stuff in a Promise.
  saveWallet(name, walletData) {
    return new Promise((resolve, reject) => {
      fs.writeFile(
        `./wallets/${name}.json`,
        JSON.stringify(walletData, null, 2),
        function(err) {
          if (err) return reject(console.error(err))

          console.log(`${name}.json written successfully.`)
          return resolve()
        }
      )
    })
  }
}

CreateWallet.description = `Generate a new HD Wallet.`

CreateWallet.flags = {
  testnet: flags.boolean({ char: "t", description: "Create a testnet wallet" }),
  name: flags.string({ char: "n", description: "Name of wallet" })
}

module.exports = CreateWallet
