/*
  Contains mocks of BITBOX library calls.
*/

"use strict"

const sinon = require("sinon")

// Inspect JS Objects.
const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true
}

const bitboxMock = {
  Mnemonic: {
    generate: sinon.stub().returns({}),
    wordLists: sinon.stub().returns({}),
    toSeed: sinon.stub().returns({})
  },
  HDNode: {
    fromSeed: sinon.stub().returns({}),
    derivePath: sinon.stub().returns({}),
    toCashAddress: sinon.stub().returns({}),
    toLegacyAddress: sinon.stub().returns({})
  }
}

module.exports = {
  bitboxMock
}
