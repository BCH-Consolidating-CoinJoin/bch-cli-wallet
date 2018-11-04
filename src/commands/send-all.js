/*
  oclif command to send all BCH in a wallet to a single address.

  This can be used to consolidate UTXOs or transfer all BCH to
  another wallet.

  This command has a negative effect on the users privacy by
  linking all addresses and UTXOs. This can be used to
  deanonymize users.

  The order of operations matter. The code below complete the following steps
  *in order*:
  -Add each UTXO as an input to the TX
  -Calculate the TX fee
  -Add the output
  -Loop through each input and sign
  -Build the transaction
  -Broadcast the transaction

*/

"use strict"

const BB = require("bitbox-sdk/lib/bitbox-sdk").default
const appUtil = require("../util")
//const GetAddress = require("./get-address")
const UpdateBalances = require("./update-balances")

// Used for debugging and error reporting.
const util = require("util")
util.inspect.defaultOptions = { depth: 2 }

const { Command, flags } = require("@oclif/command")

class SendAll extends Command {
  async run() {
    try {
      const { flags } = this.parse(SendAll)

      // Ensure flags meet qualifiying critieria.
      this.validateFlags(flags)

      const name = flags.name // Name of the wallet.
      const sendToAddr = flags.sendAddr // The address to send to.

      // Open the wallet data file.
      let walletInfo = appUtil.openWallet(name)
      walletInfo.name = name

      console.log(`Existing balance: ${walletInfo.balance} BCH`)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (walletInfo.network === "testnet")
        var BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })
      else var BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

      // Update balances before sending.
      const updateBalances = new UpdateBalances()
      walletInfo = await updateBalances.updateBalances(walletInfo, BITBOX)

      // Get all UTXOs controlled by this wallet.
      const utxos = await this.getUTXOs(walletInfo, BITBOX)
      //console.log(`utxos: ${util.inspect(utxos)}`)

      // Send the BCH, transfer change to the new address
      const txid = await this.sendAllBCH(utxos, sendToAddr, walletInfo, BITBOX)

      console.log(`TXID: ${txid}`)
    } catch (err) {
      //if (err.message) console.log(err.message)
      //else console.log(`Error in .run: `, err)
      console.log(`Error in .run: `, err)
    }
  }

  // Sends BCH to
  async sendAllBCH(utxos, sendToAddr, walletInfo, BITBOX) {
    try {
      //console.log(`utxos: ${util.inspect(utxos)}`)

      // instance of transaction builder
      if (walletInfo.network === `testnet`)
        var transactionBuilder = new BITBOX.TransactionBuilder("testnet")
      else var transactionBuilder = new BITBOX.TransactionBuilder()

      let originalAmount = 0

      // Calulate the original amount in the wallet and add all UTXOs to the
      // transaction builder.
      for (var i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]

        originalAmount = originalAmount + utxo.satoshis

        transactionBuilder.addInput(utxo.txid, utxo.vout)
      }

      // original amount of satoshis in vin
      console.log(`originalAmount: ${originalAmount}`)

      // get byte count to calculate fee. paying 1 sat/byte
      const byteCount = BITBOX.BitcoinCash.getByteCount(
        { P2PKH: utxos.length },
        { P2PKH: 1 }
      )
      console.log(`fee: ${byteCount}`)

      // amount to send to receiver. It's the original amount - 1 sat/byte for tx size
      const sendAmount = originalAmount - byteCount
      console.log(`sendAmount: ${sendAmount}`)

      // add output w/ address and amount to send
      transactionBuilder.addOutput(
        BITBOX.Address.toLegacyAddress(sendToAddr),
        sendAmount
      )

      let redeemScript

      // Loop through each input and sign
      for (var i = 0; i < utxos.length; i++) {
        const utxo = utxos[i]

        // Generate a keypair for the current address.
        const change = appUtil.changeAddrFromMnemonic(
          walletInfo.mnemonic,
          utxo.hdIndex,
          BITBOX
        )
        const keyPair = BITBOX.HDNode.toKeyPair(change)

        transactionBuilder.sign(
          i,
          keyPair,
          redeemScript,
          transactionBuilder.hashTypes.SIGHASH_ALL,
          utxo.satoshis
        )
      }

      // build tx
      const tx = transactionBuilder.build()

      // output rawhex
      const hex = tx.toHex()
      //console.log(`Transaction raw hex: ${hex}`)

      // sendRawTransaction to running BCH node
      const broadcast = await BITBOX.RawTransactions.sendRawTransaction(hex)
      //console.log(`Transaction ID: ${broadcast}`)

      return broadcast
    } catch (err) {
      console.log(`Error in sendAllBCH()`)
      throw err
    }
  }

  // Returns an array of UTXO objects. These objects contain the metadata needed
  // to optimize the selection of a UTXO for spending.
  async getUTXOs(walletInfo, BITBOX) {
    try {
      const retArray = []

      // Loop through each address that has a balance.
      for (var i = 0; i < walletInfo.hasBalance.length; i++) {
        const thisAddr = walletInfo.hasBalance[i].cashAddress

        // Get the UTXOs for that address.
        const u = await BITBOX.Address.utxo([thisAddr])
        //console.log(`u for ${thisAddr}: ${util.inspect(u[0])}`)

        // Loop through each UXTO returned
        for (var j = 0; j < u[0].length; j++) {
          const thisUTXO = u[0][j]
          //console.log(`thisUTXO: ${util.inspect(thisUTXO)}`)

          // Add the HD node index to the UTXO for use later.
          thisUTXO.hdIndex = walletInfo.hasBalance[i].index

          // Add the UTXO to the array if it has at least one confirmation.
          if (thisUTXO.confirmations > 0) retArray.push(thisUTXO)
        }
      }

      return retArray
    } catch (err) {
      console.log(`Error in getUTXOs.`)
      throw err
    }
  }

  // Validate the proper flags are passed in.
  validateFlags(flags) {
    // Exit if wallet not specified.
    const name = flags.name
    if (!name || name === "")
      throw new Error(`You must specify a wallet with the -n flag.`)

    const sendAddr = flags.sendAddr
    if (!sendAddr || sendAddr === "")
      throw new Error(`You must specify a send-to address with the -a flag.`)

    return true
  }
}

SendAll.description = `Poll the network and update the balances of the wallet.`

SendAll.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" }),
  sendAddr: flags.string({ char: "a", description: "Cash address to send to" })
}

module.exports = SendAll
