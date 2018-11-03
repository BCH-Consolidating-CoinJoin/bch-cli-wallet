/*
  TODO:
  -Returns error if name is not provided.
  -Returns error if wallet does not exist.

*/

"use strict"

const assert = require("chai").assert
const Send = require("../../src/commands/send")
const { bitboxMock } = require("../mocks/bitbox")
const BB = require("bitbox-sdk/lib/bitbox-sdk").default
const testwallet = require("../mocks/testwallet.json")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("send", () => {
  let BITBOX

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
  })

  it("should throw error if name is not supplied.", async () => {
    try {
      const send = new Send()
      await send.validateFlags({})
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a wallet with the -n flag`,
        "Expected error message."
      )
    }
  })

  it("should throw error if BCH quantity is not supplied.", async () => {
    try {
      const flags = {
        name: `testwallet`
      }

      const send = new Send()
      await send.validateFlags(flags)
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a quantity in BCH with the -b flag.`,
        "Expected error message."
      )
    }
  })

  it("should throw error if recieving address is not supplied.", async () => {
    try {
      const flags = {
        name: `testwallet`,
        bch: 0.000005
      }

      const send = new Send()
      await send.validateFlags(flags)
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a send-to address with the -a flag.`,
        "Expected error message."
      )
    }
  })

  it("should get balances for all addresses in wallet", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const send = new Send()
    const utxos = await send.getUTXOs(testwallet, BITBOX)
    //console.log(`utxos: ${util.inspect(utxos)}`)

    assert.isArray(utxos, "Expect array of utxos")
    assert.hasAllKeys(utxos[0], [
      "txid",
      "vout",
      "scriptPubKey",
      "amount",
      "satoshis",
      "height",
      "confirmations",
      "legacyAddress",
      "cashAddress"
    ])
  })
  /*
  it("generates a hasBalance array", async () => {
    // Retrieve mocked data.
    const addressData = BITBOX.Address.details()

    const updateBalances = new UpdateBalances()
    const hasBalance = await updateBalances.generateHasBalance(addressData)
    //console.log(`hasBalance: ${util.inspect(hasBalance)}`)

    assert.isArray(hasBalance, "Expect array of addresses with balances.")
    assert.hasAllKeys(hasBalance[0], [
      "index",
      "balance",
      "balanceSat",
      "unconfirmedBalance",
      "unconfirmedBalanceSat",
      "cashAddress"
    ])
  })

  it("should aggregate balances", async () => {
    // Retrieve mocked data
    const addressData = BITBOX.Address.details()
    const updateBalances = new UpdateBalances()
    const hasBalance = await updateBalances.generateHasBalance(addressData)

    const balanceTotal = await updateBalances.sumConfirmedBalances(hasBalance)
    //console.log(`balanceTotal: ${balanceTotal}`)

    assert.equal(balanceTotal, 0.09999751999999999)
  })

  it("should update balances", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const updateBalances = new UpdateBalances()
    const walletInfo = await updateBalances.updateBalances(testwallet, BITBOX)
    //console.log(`walletInfo: ${JSON.stringify(walletInfo, null, 2)}`)

    assert.hasAllKeys(walletInfo, [
      "network",
      "mnemonic",
      "balance",
      "nextAddress",
      "hasBalance",
      "rootAddress",
      "name"
    ])

    assert.isArray(
      walletInfo.hasBalance,
      "Expect array of addresses with balances."
    )
  })
  */
})
