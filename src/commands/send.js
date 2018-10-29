/*
  oclif command to send BCH to an address.

  The 'update-balances' command should be run before executing this command, so
  the wallet has the most up to date balances.

  The spending of UTXOs is optimized for privacy. The UTXO selected is equal to
  or bigger than the amount specified, but as close to it as possible. Change is
  always sent to a new address.

  This method of selecting UTXOs can leave a lot of dust UTXOs lying around in
  the wallet. It is assumed the user will consolidate the dust UTXOs periodically
  with an online service, as described here:
  https://gist.github.com/christroutner/457b99b8033fdea5ae565687e6360323
*/

"use strict"

const BB = require("bitbox-sdk/lib/bitbox-sdk").default
const appUtil = require("../util")
const GetAddress = require("./get-address")

// Used for debugging and error reporting.
const util = require("util")
util.inspect.defaultOptions = { depth: 2 }

const { Command, flags } = require("@oclif/command")

class Send extends Command {
  async run() {
    try {
      const { flags } = this.parse(Send)

      // Ensure flags meet qualifiying critieria.
      this.validateFlags(flags)

      const name = flags.name // Name of the wallet.
      const bch = flags.bch // Amount to send in BCH.
      const sendToAddr = flags.sendAddr // The address to send to.

      // Open the wallet data file.
      const walletInfo = appUtil.openWallet(name)
      walletInfo.name = name

      console.log(`Existing balance: ${walletInfo.balance} BCH`)

      // Determine if this is a testnet wallet or a mainnet wallet.
      if (walletInfo.network === "testnet")
        var BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })
      else var BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

      // Get info on UTXOs controlled by this wallet.
      const utxos = await this.getUTXOs(walletInfo, BITBOX)
      console.log(`utxos: ${util.inspect(utxos)}`)

      // Select optimal UTXO
      const utxo = await this.selectUTXO(bch, utxos, BITBOX)
      console.log(`selected utxo: ${util.inspect(utxo)}`)

      // Exit if there is no UTXO big enough to fulfill the transaction.
      if (!utxo.amount) {
        this.log(`Could not find a UTXO big enough for this transaction.`)
        return
      }

      // Generate a new address, for sending change to.
      const getAddress = new GetAddress()
      const changeAddress = await getAddress.getAddress(name, BITBOX)
      console.log(`changeAddress: ${changeAddress}`)

      // Send the BCH, transfer change to the new address.
      const txid = await this.sendBCH(
        utxo,
        bch,
        changeAddress,
        sendToAddr,
        walletInfo,
        BITBOX
      )

      console.log(`TXID: ${txid}`)
    } catch (err) {
      if (err.message) console.log(err.message)
      else console.log(`Error in .run: `, err)
    }
  }

  // Sends BCH to
  async sendBCH(utxo, bch, changeAddress, sendToAddr, walletInfo, BITBOX) {
    try {
      // instance of transaction builder
      if (walletInfo.network === `testnet`)
        var transactionBuilder = new BITBOX.TransactionBuilder("testnet")
      else var transactionBuilder = new BITBOX.TransactionBuilder()

      const satoshisToSend = bch * 100000000
      console.log(`Amount to send in satoshis: ${satoshisToSend}`)
      const originalAmount = utxo.satoshis

      const vout = utxo.vout
      const txid = utxo.txid

      // add input with txid and index of vout
      transactionBuilder.addInput(txid, vout)

      // get byte count to calculate fee. paying 1 sat/byte
      const byteCount = BITBOX.BitcoinCash.getByteCount(
        { P2PKH: 1 },
        { P2PKH: 2 }
      )
      console.log(`byteCount: ${byteCount}`)
      const satoshisPerByte = 1.1
      const txFee = Math.floor(satoshisPerByte * byteCount)
      console.log(`txFee: ${txFee} satoshis\n`)

      // amount to send back to the sending address. It's the original amount - 1 sat/byte for tx size
      const remainder = originalAmount - satoshisToSend - txFee

      // add output w/ address and amount to send
      transactionBuilder.addOutput(sendToAddr, satoshisToSend)
      transactionBuilder.addOutput(changeAddress, remainder)

      // Generate a keypair from the change address.
      const change = appUtil.changeAddrFromMnemonic(
        walletInfo.mnemonic,
        utxo.hdIndex,
        BITBOX
      )
      const keyPair = BITBOX.HDNode.toKeyPair(change)

      // Sign the transaction with the HD node.
      let redeemScript
      transactionBuilder.sign(
        0,
        keyPair,
        redeemScript,
        transactionBuilder.hashTypes.SIGHASH_ALL,
        originalAmount
      )

      // build tx
      const tx = transactionBuilder.build()
      // output rawhex
      const hex = tx.toHex()
      console.log(`Transaction raw hex: `)
      //console.log(hex)

      // sendRawTransaction to running BCH node
      const broadcast = await BITBOX.RawTransactions.sendRawTransaction(hex)
      //console.log(`Transaction ID: ${broadcast}`)
      return broadcast
    } catch (err) {
      console.log(`Error in sendBCH()`)
      throw err
    }
  }

  // Selects a UTXO from an array of UTXOs based on this optimization criteria:
  // 1. The UTXO must be larger than or equal to the amount of BCH to send.
  // 2. The UTXO should be as close to the amount of BCH as possible.
  //    i.e. as small as possible
  // Returns a single UTXO object.
  selectUTXO(bch, utxos, BITBOX) {
    let candidateUTXO = {}

    // Loop through all the UTXOs.
    for (var i = 0; i < utxos.length; i++) {
      const thisUTXO = utxos[i]
      // The UTXO must be greater than or equal to the send amount.
      if (thisUTXO.amount >= bch) {
        // Automatically assign if the candidateUTXO is an empty object.
        if (!candidateUTXO.amount) {
          candidateUTXO = thisUTXO
          continue

          // Replace the candidate if the current UTXO is closer to the send amount.
        } else if (candidateUTXO.amount > thisUTXO.amount) {
          candidateUTXO = thisUTXO
        }
      }
    }

    return candidateUTXO
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

    const bch = flags.bch
    if (isNaN(Number(bch)))
      throw new Error(`You must specify a quantity in BCH with the -b flag.`)

    const sendAddr = flags.sendAddr
    if (!sendAddr || sendAddr === "")
      throw new Error(`You must specify a send-to address with the -a flag.`)

    return true
  }
}

Send.description = `Poll the network and update the balances of the wallet.`

Send.flags = {
  name: flags.string({ char: "n", description: "Name of wallet" }),
  bch: flags.string({ char: "b", description: "Quantity in BCH" }),
  sendAddr: flags.string({ char: "a", description: "Cash address to send to" })
}

module.exports = Send
