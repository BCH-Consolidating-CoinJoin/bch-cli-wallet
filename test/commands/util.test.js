/*
  TODO:
*/

"use strict"

const assert = require("chai").assert
const appUtil = require("../../src/util")
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

  it("should throw error if wallet file not found.", async () => {
    try {
      await appUtil.openWallet("doesnotexist")
    } catch (err) {
      assert.include(err.message, `Could not open`, "Expected error message.")
    }
  })
})
