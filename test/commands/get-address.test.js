/*
  TODO:
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

  it("increments the nextAddress property of the wallet.", async () => {
    // Use the real library if this is not a unit test
    if (process.env.TEST !== "unit")
      BITBOX = new BB({ restURL: "https://trest.bitcoin.com/v1/" })

    // Create a testnet wallet
    const createWallet = new CreateWallet()
    const initialWalletInfo = await createWallet.createWallet(
      "test123",
      BITBOX,
      "testnet"
    )
    //console.log(`initialWalletInfo: ${util.inspect(initialWalletInfo)}`)

    // Record the initial nextAddress property. This is going to be 1 for a new wallet.
    const firstAddressIndex = initialWalletInfo.nextAddress

    // Generate a new address
    const getAddress = new GetAddress()
    await getAddress.getAddress(`test123`, BITBOX)

    // Delete the cached copy of the wallet. This allows testing of list-wallets.
    delete require.cache[require.resolve(`../../wallets/test123`)]

    // Read in the wallet file.
    const walletInfo = require(`../../wallets/test123`)
    //console.log(`walletInfo: ${util.inspect(walletInfo)}`)

    assert.equal(
      walletInfo.nextAddress,
      firstAddressIndex + 1,
      "nextAddress property should increment"
    )
  })
})
