/*
  oclif command to get a new recieve address.
*/

"use strict"

const BB = require("bitbox-sdk/lib/bitbox-sdk").default

const { Command, flags } = require("@oclif/command")

class GetAddress extends Command {
  async run() {
    const { flags } = this.parse(GetAddress)

    // Determine if this is a testnet wallet or a mainnet wallet.
    if (flags.testnet)
      var BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })
    else var BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

    await this.getAddress(flags.name, BITBOX)
  }

  async getAddress(name, BITBOX) {
    // Exit if wallet not specified.
    if (!name || name === "") {
      this.log(`You must specify a wallet with the -n flag.`)
      this.exit(0)
    }

    const walletInfo = this.openWallet(name)
    console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)
  }

  // Open a wallet by file name.
  openWallet(name) {
    try {
      const walletInfo = require(`../../wallets/${name}.json`)
      return walletInfo
    } catch (err) {
      this.log(`Could not open ${name}.json`)
      this.exit(1)
    }
  }
}

GetAddress.description = `Generate a new address to recieve BCH.`

GetAddress.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" })
}

module.exports = GetAddress
