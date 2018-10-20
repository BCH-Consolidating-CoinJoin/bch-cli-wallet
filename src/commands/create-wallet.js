"use strict"

const fs = require("fs")
const BB = require("bitbox-sdk/lib/bitbox-sdk").default
// const BITBOX = new BB({ restURL: `https://trest.bitcoin.com/v1/` })
// const BITBOX = new BB({ restURL: `http://localhost:3000/v1/` })
// const BITBOX = new BB({ restURL: `http://decatur.hopto.org:3003/v1/` })
// const BITBOX = new BB({ restURL: `http://192.168.0.13:3003/v1/` })

const { Command, flags } = require("@oclif/command")

class CreateWallet extends Command {
  async run() {
    const { flags } = this.parse(CreateWallet)

    const name = flags.name
    if (!name) {
      this.log(`Please supply a name for the wallet with the -n argument.`)
      this.exit(1)
    }

    const testnet = flags.testnet
    await createWallet(testnet, name)
  }
}

CreateWallet.description = `Generate a new HD Wallet.`

CreateWallet.flags = {
  testnet: flags.boolean({ char: "t", description: "Create a testnet wallet" }),
  name: flags.string({ char: "n", description: "Name of wallet" })
}

async function createWallet(testnet, name) {
  if (testnet) var BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })
  else var BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

  const walletData = {}

  // create 256 bit BIP39 mnemonic
  const mnemonic = BITBOX.Mnemonic.generate(
    256,
    BITBOX.Mnemonic.wordLists().english
  )
  walletData.mnemonic = mnemonic

  // root seed buffer
  const rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)

  // master HDNode
  if (testnet) var masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, "testnet")
  else var masterHDNode = BITBOX.HDNode.fromSeed(rootSeed)

  // HDNode of BIP44 account
  const account = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

  // derive the first external change address HDNode which is going to spend utxo
  const change = BITBOX.HDNode.derivePath(account, "0/0")

  // get the cash address
  walletData.address = BITBOX.HDNode.toCashAddress(change)

  // Write out the basic information into a json file for other apps to use.
  fs.writeFile(
    `./wallets/${name}.json`,
    JSON.stringify(walletData, null, 2),
    function(err) {
      if (err) return console.error(err)
      console.log(`${name}.json written successfully.`)
    }
  )

  console.log(`mnemonic: ${mnemonic}`)
}

module.exports = CreateWallet
