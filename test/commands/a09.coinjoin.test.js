/*
  TODO:


*/

"use strict"

const assert = require("chai").assert
const CoinJoin = require("../../src/commands/coinjoin")
const { bitboxMock } = require("../mocks/bitbox")
const coinjoinMock = require("../mocks/coinjoin")
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

  it("returns false for less than 1 output address", async () => {
    const coinJoinOut = 0.01
    const balance = 0.009

    const result = await coinJoin.calcOutAddrs(
      coinJoinOut,
      balance,
      undefined,
      BITBOX
    )

    assert.equal(result, false, "Expected false returned")
  })

  it("returns expected number of output address", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const coinJoinOut = 0.01
    const balance = 0.023
    const filename = `${__dirname}/../../wallets/test123.json`

    const result = await coinJoin.calcOutAddrs(
      coinJoinOut,
      balance,
      filename,
      BITBOX
    )
    //console.log(`result: ${util.inspect(result)}`)

    assert.isArray(result)
    assert.equal(result.length, 3)
  })

  it("should register with CoinJoin server", async () => {
    // Mock the Insight URL for unit tests.
    if (process.env.TEST === "unit") {
      nock(`${SERVER}`)
        .post(`/address`)
        .reply(200, coinjoinMock.mockParticipantOut)
    }

    const outAddrs = [
      "bchtest:qp59ewqj0gkymj4x436gz56pa2e299uy7vqaus9f5s",
      "bchtest:qqy6gl9c6rmjnfq66pwmemcpsneenu5ppyysnkgdlq",
      "bchtest:qr766g7lyycs0jgz95tm9rgzpj86gh9l8ym5esnmqy"
    ]

    // Construct the participant object
    const participantIn = {
      outAddrs,
      numInputs: 2,
      amount: 0.23
    }

    const result = await coinJoin.registerWithCoinJoin(SERVER, participantIn)
    //console.log(`result: ${util.inspect(result)}`)

    assert.hasAnyKeys(result, [
      "inputAddrs",
      "outputAddrs",
      "txids",
      "_id",
      "round",
      "satoshisReported"
    ])
    assert.isArray(result.inputAddrs)
    assert.isArray(result.outputAddrs)
    assert.isArray(result.txids)
    assert.isNumber(result.round)
  })

  it("should send UTXO", async () => {
    const utxo = {
      txid: "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
      vout: 0,
      scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac",
      amount: 0.03,
      satoshis: 3000000,
      height: 1265272,
      confirmations: 733,
      legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
      cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
      hdIndex: 2
    }

    const sendToAddr = "bchtest:qzu2kpj7vgxnju2c9awnzssrl28qc0u5fvy3lqq59v"

    const result = await coinJoin.sendUtxo(
      utxo,
      sendToAddr,
      mockedWallet,
      BITBOX
    )
    //console.log(`result: ${util.inspect(result)}`)

    assert.isString(result)
  })
})
