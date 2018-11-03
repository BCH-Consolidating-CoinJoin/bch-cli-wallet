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

const addressDetails = [
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0,
    totalReceivedSat: 0,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 0,
    transactions: [],
    legacyAddress: "mv9wPCHx2iCdbXBkJ1UTAZCAq57PCL2YQ9",
    cashAddress: "bchtest:qzsfqeqtdk6plsvglccadkqtf0trf2nyz58090e6tt",
    addressIndex: 0
  },
  {
    balance: 0,
    balanceSat: 0,
    totalReceived: 0.1,
    totalReceivedSat: 10000000,
    totalSent: 0.1,
    totalSentSat: 10000000,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 2,
    transactions: [
      "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
      "85ddb8215fc3701a493cf1c450644c5ef32c55aaa2f48ae2d008944394f3e4d3"
    ],
    legacyAddress: "n3A9BmjrEG3ubJeoAJGwjkymhmqZhGbZR2",
    cashAddress: "bchtest:qrkkx8au5lxsu2hka2c4ecn3juxjpcuz05wh08hhl2",
    addressIndex: 1
  },
  {
    balance: 0.03,
    balanceSat: 3000000,
    totalReceived: 0.03,
    totalReceivedSat: 3000000,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 1,
    transactions: [
      "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b"
    ],
    legacyAddress: "msnHMfK2pwaBWdE7a7y4f7atdzYahRM7t8",
    cashAddress: "bchtest:qzrg022p8ykc90c27gy808pmz3lzlwk6lg77y3h8fm",
    addressIndex: 2
  },
  {
    balance: 0.06999752,
    balanceSat: 6999752,
    totalReceived: 0.06999752,
    totalReceivedSat: 6999752,
    totalSent: 0,
    totalSentSat: 0,
    unconfirmedBalance: 0,
    unconfirmedBalanceSat: 0,
    unconfirmedTxApperances: 0,
    txApperances: 1,
    transactions: [
      "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b"
    ],
    legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
    cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
    addressIndex: 3
  }
]

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
  },
  Address: {
    details: sinon.stub().returns(addressDetails)
  }
}

module.exports = {
  bitboxMock
}
