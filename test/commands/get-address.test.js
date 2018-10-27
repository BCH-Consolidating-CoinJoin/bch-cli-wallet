/*
  TODO:
  -Returns error if name is not provided.
  -Returns error if wallet does not exist.
  -Increments the nextAddress property of the wallet.
*/

"use strict"

const assert = require("chai").assert
const CreateWallet = require("../../src/commands/create-wallet")
const GetAddress = require("../../src/commands/get-address")
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

describe("get-address", () => {
  let BITBOX

  beforeEach(() => {
    // By default, use the mocking library instead of live calls.
    BITBOX = bitboxMock
  })

  it("should throw error if name is not supplied.", async () => {
    try {
      const getAddress = new GetAddress()
      await getAddress.getAddress(undefined, BITBOX)
    } catch (err) {
      assert.include(
        err.message,
        `You must specify a wallet with the -n flag`,
        "Expected error message."
      )
    }
  })

  it("should throw error if wallet file not found.", async () => {
    try {
      const getAddress = new GetAddress()
      await getAddress.getAddress(`doesnotexist`, BITBOX)
    } catch (err) {
      assert.include(err.message, `Could not open`, "Expected error message.")
    }
  })
})
