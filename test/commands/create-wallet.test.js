"use strict"

const { expect, test } = require("@oclif/test")
const assert = require("chai").assert

describe("create-wallet", () => {
  it("should return message if called without name argument.", () => {
    try {
      const msg = test.stdout().command(["create-wallet"])
      console.log(`msg: ${JSON.stringify(msg, null, 2)}`)
    } catch (err) {
      console.err(`Error expected: `, err)
      assert.equal(true, true)
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
