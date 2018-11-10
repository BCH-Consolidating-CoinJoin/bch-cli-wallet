/*
  oclif command to send BCH to a Consolidating CoinJoin server.

  This command can be used to consolidate UTXOs in the wallet while preserving
  privacy. It can also be used to shuffle BCH into new addresses and restore
  privacy that was lost.

  This initial version sends all BCH in all addresses in the wallet to the
  CoinJoin server. Future features will allow users to specify a lower-bound
  threshold, where any UTXOs less than the threashold would be consolidated
  through the CoinJoin server.

  This command has the following high-level flow:
  -Query the standard amount from the server.
  -Calculate and generate the output addresses.
  -Request the needed input addresses, and submit the output addresses.
  -Send BCH to the input addresses.

*/

"use strict"

const BB = require("bitbox-sdk/lib/bitbox-sdk").default
const appUtil = require("../util")
const GetAddress = require("./get-address")
const UpdateBalances = require("./update-balances")
const rp = require("request-promise")

// Used for debugging and error reporting.
const util = require("util")
util.inspect.defaultOptions = { depth: 2 }

const { Command, flags } = require("@oclif/command")

class CoinJoin extends Command {
  async run() {
    try {
      const { flags } = this.parse(CoinJoin)

      // Ensure flags meet qualifiying critieria.
      this.validateFlags(flags)

      const name = flags.name // Name of the wallet.
      // Generate an absolute filename from the name.
      const filename = `${__dirname}/../../wallets/${flags.name}.json`
      const server = flags.server // The address to send to.

      // Open the wallet data file.
      let walletInfo = appUtil.openWallet(filename)
      walletInfo.name = name

      console.log(`Existing balance: ${walletInfo.balance} BCH`)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (walletInfo.network === "testnet")
        var BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })
      else var BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

      // Query the server's standard BCH output.
      const coinJoinOut = await this.getCoinJoinOut(server)
      console.log(`CoinJoin standard output: ${coinJoinOut} BCH`)
      if (!coinJoinOut) {
        this.log(`Could not connect with CoinJoin server.`)
        return
      }

      // Calculate the number of output addresses, based on the standarized CoinJoin output.
      const outAddrs = await this.calcOutAddrs(
        coinJoinOut,
        walletInfo.balance,
        filename,
        BITBOX
      )
      console.log(`OutAddrs: ${util.inspect(outAddrs)}`)
      if (!outAddrs) {
        this.log(`
Less than one output wallet needed.
Try a server with a lower standard output.`)
        return
      }

      // Update balances before sending.
      const updateBalances = new UpdateBalances()
      walletInfo = await updateBalances.updateBalances(walletInfo, BITBOX)

      // Get all UTXOs controlled by this wallet.
      const utxos = await appUtil.getUTXOs(walletInfo, BITBOX)
      console.log(`utxos: ${util.inspect(utxos)}`)

      console.log(`number of utxos: ${utxos.length}`)
      console.log(`number of input addresses: ${walletInfo.hasBalance.length}`)

      // Construct the participant object
      const participantIn = {
        outAddrs: outAddrs,
        numInputs: walletInfo.hasBalance.length,
        amount: walletInfo.balance
      }

      // Register as a participant on the Consolidating CoinJoin server
      const participantOut = this.registerWithCoinJoin(server, participantIn)
      console.log(`participantOut: ${util.inspect(participantOut)}`)

      // Send the BCH, transfer change to the new address
      //const txid = await this.sendAllBCH(utxos, sendToAddr, walletInfo, BITBOX)

      //console.log(`TXID: ${txid}`)
    } catch (err) {
      //if (err.message) console.log(err.message)
      //else console.log(`Error in .run: `, err)
      console.log(`Error in .run: `, err)
    }
  }

  // Register as a participant with the Consolidating CoinJoin server
  async registerWithCoinJoin(server, participantIn) {
    try {
      const options = {
        method: "POST",
        uri: `${server}/address`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: "application/json"
        },
        body: participantIn
      }

      const result = await rp(options)
      console.log(`result.body: ${util.inspect(result.body)}`)

      const participantOut = result.body
      return participantOut
    } catch (err) {
      console.log(`Error in coinjoin.js/registerWithCoinJoin()`)
      throw err
    }
  }

  // Calulates the number of output addresses needed, based on the standard BCH
  // output of the CoinJoin Server. It then automatically generates that many
  // address and returns an array of BCH addresses.
  // Returns false if the input values don't make sense.
  async calcOutAddrs(coinJoinOut, balance, filename, BITBOX) {
    try {
      const sanityCheck = balance / coinJoinOut

      // Less than 1 output address doesn't make sense.
      if (sanityCheck < 1) return false

      const numAddrs = Math.ceil(sanityCheck)

      const addrs = []
      const getAddr = new GetAddress()

      for (var i = 0; i < numAddrs; i++) {
        const thisAddr = await getAddr.getAddress(filename, BITBOX)
        addrs.push(thisAddr)
      }

      return addrs
    } catch (err) {
      console.log(`Error in coinjoin.js/calcOutAddrs()`)
      throw err
    }
  }

  // Queries the server to get the standard BCH output value used by the server.
  // Returns a Number representing the amount of BCH.
  // Throws error if there are issues.
  async getCoinJoinOut(server) {
    try {
      const options = {
        method: "GET",
        uri: `${server}/coinjoinout`,
        resolveWithFullResponse: true,
        json: true,
        headers: {
          Accept: "application/json"
        }
      }

      const result = await rp(options)
      //console.log(`result.body: ${util.inspect(result.body)}`)

      const coinJoinOut = result.body.coinjoinout
      return Number(coinJoinOut)
    } catch (err) {
      console.log(`Error in coinjoin.js/getCoinJoinOut()`)
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    // Exit if wallet not specified.
    const name = flags.name
    if (!name || name === "")
      throw new Error(`You must specify a wallet with the -n flag.`)

    //const server = flags.server
    //if (!server || server === "")
    //  throw new Error(`You must specify the CoinJoin server.`)
    flags.server = "http://localhost:5000"

    return true
  }
}

CoinJoin.description = `
Send all BCH in a wallet to another address. This method has a negative impact
on privacy by linking all addresses in a wallet.
`

CoinJoin.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" }),
  sendAddr: flags.string({ char: "a", description: "Cash address to send to" })
}

module.exports = CoinJoin
