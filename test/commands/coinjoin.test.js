/*
  TODO:


*/

"use strict"

const assert = require("chai").assert
const CoinJoin = require("../../src/commands/coinjoin")
const { bitboxMock } = require("../mocks/bitbox")
const BB = require("bitbox-sdk/lib/bitbox-sdk").default
const testwallet = require("../mocks/testwallet.json")
const nock = require("nock") // HTTP mocking

const SERVER = "http://localhost:5000"

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("CoinJoin", () => {
  let BITBOX
  let mockedWallet
  let coinJoin

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
    mockedWallet = Object.assign({}, testwallet) // Clone the testwallet
    coinJoin = new CoinJoin()
  })

  it("should throw error if name is not supplied.", () => {
    try {
      coinJoin.validateFlags({})
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a wallet with the -n flag`,
        "Expected error message."
      )
    }
  })

  it("should return true if all flags are supplied.", () => {
    const flags = {
      name: `testwallet`
    }

    const result = coinJoin.validateFlags(flags)

    assert.equal(result, true)
  })

  it("should retrieve server standard CoinJoin Output", async () => {
    // Mock the Insight URL for unit tests.
    if (process.env.TEST === "unit") {
      nock(`${SERVER}`)
        .get(`/coinjoinout`)
        .reply(200, { coinjoinout: "0.01" })
    }

    const result = await coinJoin.getCoinJoinOut(SERVER)
    //console.log(`result: ${util.inspect(result)}`)

    assert.isNumber(result)
  })

  /*
  it("should send BCH on testnet", async () => {

    const utxos = [
      {
        txid:
          "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
        vout: 1,
        scriptPubKey: "76a9142b0379444f2e01905b2dd511644af4f53556edeb88ac",
        amount: 0.06999752,
        satoshis: 6999752,
        height: 1265272,
        confirmations: 644,
        legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
        cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
        hdIndex: 3
      },
      {
        txid:
          "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
        vout: 0,
        scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac",
        amount: 0.03,
        satoshis: 3000000,
        height: 1265272,
        confirmations: 733,
        legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
        cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
        hdIndex: 3
      }
    ]

    const sendToAddr = `bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt`

    const sendAll = new SendAll()
    const txid = await sendAll.sendAllBCH(
      utxos,
      sendToAddr,
      mockedWallet,
      BITBOX
    )

    assert.equal(txid, `mockTXID`)
  })
/*
  it("should send BCH on mainnet", async () => {
    const utxos = [
      {
        txid:
          "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
        vout: 1,
        scriptPubKey: "76a9142b0379444f2e01905b2dd511644af4f53556edeb88ac",
        amount: 0.06999752,
        satoshis: 6999752,
        height: 1265272,
        confirmations: 644,
        legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
        cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
        hdIndex: 3
      },
      {
        txid:
          "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
        vout: 0,
        scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac",
        amount: 0.03,
        satoshis: 3000000,
        height: 1265272,
        confirmations: 733,
        legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
        cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
        hdIndex: 3
      }
    ]

    const sendToAddr = `bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt`

    // Switch to mainnet
    mockedWallet.network = "mainnet"

    const sendAll = new SendAll()
    const txid = await sendAll.sendAllBCH(
      utxos,
      sendToAddr,
      mockedWallet,
      BITBOX
    )

    assert.equal(txid, `mockTXID`)
  })
  */
})
