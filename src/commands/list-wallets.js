"use strict"

//const fs = require("fs")
//const BB = require("bitbox-sdk/lib/bitbox-sdk").default

const shelljs = require("shelljs")

const { Command, flags } = require("@oclif/command")

class ListWallets extends Command {
  async run() {
    const { flags } = this.parse(ListWallets)

    listWallets()
  }
}

ListWallets.description = `List existing wallets.`

ListWallets.flags = {
  //testnet: flags.boolean({ char: "t", description: "Create a testnet wallet" }),
  //name: flags.string({ char: "n", description: "Name of wallet" })
}

function listWallets() {
  const fileList = shelljs.ls("wallets/*.json")

  if (fileList.length === 0) {
    console.log(`No wallets found.`)
    return
  }

  // Loop through each wallet returned.
  for (let i = 0; i < fileList.length; i++) {
    const thisFile = fileList[i]

    const lastPart = thisFile.indexOf(`.json`)
    const name = thisFile.slice(8, lastPart)

    console.log(`name: ${name}`)
  }
}

module.exports = ListWallets
