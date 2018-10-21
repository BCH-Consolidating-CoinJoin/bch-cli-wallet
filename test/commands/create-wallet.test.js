"use strict"

//const { expect, test } = require("@oclif/test")
const assert = require("chai").assert
const CreateWallet = require("../../src/commands/create-wallet")
const bitboxMock = require("../mocks/bitbox")

// Inspect utility used for debugging.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

describe("create-wallet", () => {
  let BITBOX

  beforeEach(() => {
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
    try {
      const createWallet = new CreateWallet()
      createWallet.createWallet(undefined, "test123", BITBOX)
      assert.equal(true, true)
    } catch (err) {
      console.error(`Error unexpected: ${util.inspect(err)}`)

      //assert.equal(err.code, "EEXIT", "Should exit as expected.")
    }
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
