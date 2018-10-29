/*
  TODO:
  -Returns error if name is not provided.
  -Returns error if wallet does not exist.

*/

"use strict"

const assert = require("chai").assert
const UpdateBalances = require("../../src/commands/update-balances")
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

describe("update-balances", () => {
  let BITBOX

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
  })

  it("should throw error if name is not supplied.", async () => {
    try {
      const updateBalances = new UpdateBalances()
      await updateBalances.validateFlags({})
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a wallet with the -n flag`,
        "Expected error message."
      )
    }
  })
})
