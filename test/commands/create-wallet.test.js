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

describe("create-wallet", () => {
  let BITBOX

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
  })

  it("should exit with error status if called without name argument.", () => {
    try {
      const createWallet = new CreateWallet()
      createWallet.createWallet(undefined, undefined, BITBOX)
    } catch (err) {
      //console.error(`Error expected: ${util.inspect(err)}`)

      assert.equal(err.code, "EEXIT", "Should exit as expected.")
    }
  })

  it("should create a mainnet wallet file with the given name", () => {
    // Use the real library if this is not a unit test.
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://rest.bitcoin.com/v1/" })

    const createWallet = new CreateWallet()
    const walletData = createWallet.createWallet(undefined, "test123", BITBOX)

    assert.equal(walletData.network, "mainnet")
    assert.hasAllKeys(walletData, [
      "network",
      "mnemonic",
      "balance",
      "addressUsed",
      "hasBalance"
    ])
  })

  /*
  test
    .stdout()
    .command(["create-wallet"])
    .it("runs create-wallet", ctx => {
      try {

      }
      assert.equal(
        ctx.stdout,
        "Please supply a name for the wallet with the -n argument."
      )
      //expect(ctx.stdout).to.contain(
      //  "Please supply a name for the wallet with the -n argument."
      //)
    })
    */
  /*
  test
    .stdout()
    .command(["hello", "--name", "jeff"])
    .it("runs hello --name jeff", ctx => {
      expect(ctx.stdout).to.contain("hello jeff")
    })
    */
})
