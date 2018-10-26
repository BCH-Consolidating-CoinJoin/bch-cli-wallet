"use strict"

//const { expect, test } = require("@oclif/test")
const assert = require("chai").assert
const CreateWallet = require("../../src/commands/create-wallet")
const { bitboxMock } = require("../mocks/bitbox")
const BB = require("bitbox-sdk/lib/bitbox-sdk").default

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// Set default environment variables for unit tests.
if (!process.env.TEST) process.env.TEST = "unit"

describe("list-wallets", () => {
  let BITBOX

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
  })

  /*
  it("should exit with error status if called without name argument.", async () => {
    try {
      const createWallet = new CreateWallet()
      await createWallet.createWallet(undefined, undefined, BITBOX)
    } catch (err) {
      //console.error(`Error expected: ${util.inspect(err)}`)

      assert.equal(err.code, "EEXIT", "Should exit as expected.")
    }
  })

  it("should create a mainnet wallet file with the given name", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

    const createWallet = new CreateWallet()
    const walletData = await createWallet.createWallet(
      undefined,
      "test123",
      BITBOX
    )

    assert.equal(walletData.network, "mainnet", "Expecting mainnet address")
    assert.hasAllKeys(walletData, [
      "network",
      "mnemonic",
      "balance",
      "nextAddress",
      "hasBalance",
      "rootAddress"
    ])

    // hasBalance is an array of objects. Each object represents an address with
    // a balance.
    assert.isArray(walletData.hasBalance)

    // For an integration test, ensure the rootAddress actually reflects mainnet.
    if (process.env.TEST !== "unit")
      assert.equal(walletData.rootAddress.indexOf("bitcoincash") > -1java -Xmx1024M -Xms1024M -jar minecraft_server.1.13.2.jar nogui, true)
  })

  it("should create a testnet wallet file with the given name", async () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    const createWallet = new CreateWallet()
    const walletData = await createWallet.createWallet(
      "testnet",
      "test123",
      BITBOX
    )

    assert.equal(walletData.network, "testnet", "Expecting mainnet address")
    assert.hasAllKeys(walletData, [
      "network",
      "mnemonic",
      "balance",
      "nextAddress",
      "hasBalance",
      "rootAddress"
    ])

    // hasBalance is an array of objects. Each object represents an address with
    // a balance.
    assert.isArray(walletData.hasBalance)

    // For an integration test, ensure the rootAddress actually reflects mainnet.
    if (process.env.TEST !== "unit")
      assert.equal(walletData.rootAddress.indexOf("bchtest") > -1, true)
  })
  */
})
