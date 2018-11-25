/*
  Contains mocks for use with the coinjoin command.
*/

"use strict"

const mockParticipantOut = {
  inputAddrs: [
    "bchtest:qzu2kpj7vgxnju2c9awnzssrl28qc0u5fvy3lqq59v",
    "bchtest:qr2pu26w6jwj952s3ntfwp6v24txaw8lwyuxnul7w8"
  ],
  outputAddrs: [
    "bchtest:qp59ewqj0gkymj4x436gz56pa2e299uy7vqaus9f5s",
    "bchtest:qqy6gl9c6rmjnfq66pwmemcpsneenu5ppyysnkgdlq",
    "bchtest:qr766g7lyycs0jgz95tm9rgzpj86gh9l8ym5esnmqy"
  ],
  txids: [],
  _id: "5be879c73add8e72b1c626be",
  round: 0,
  satoshisReported: 0.23,
  __v: 0
}

const mockUtxos = [
  {
    txid: "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
    vout: 1,
    scriptPubKey: "76a9142b0379444f2e01905b2dd511644af4f53556edeb88ac",
    amount: 0.06999752,
    satoshis: 6999752,
    height: 1265272,
    confirmations: 644,
    legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
    cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
    hdIndex: 3
  },
  {
    txid: "26564508facb32a5f6893cb7bdfd2dcc264b248a1aa7dd0a572117667418ae5b",
    vout: 0,
    scriptPubKey: "76a9148687a941392d82bf0af208779c3b147e2fbadafa88ac",
    amount: 0.03,
    satoshis: 3000000,
    height: 1265272,
    confirmations: 733,
    legacyAddress: "mjSPWfCwCgHZC27nS8GQ4AXz9ehhb2GFqz",
    cashAddress: "bchtest:qq4sx72yfuhqryzm9h23zez27n6n24hdavvfqn2ma3",
    hdIndex: 2
  }
]

const mockOutputAddrs = [
  "bchtest:qp59ewqj0gkymj4x436gz56pa2e299uy7vqaus9f5s",
  "bchtest:qqy6gl9c6rmjnfq66pwmemcpsneenu5ppyysnkgdlq",
  "bchtest:qr766g7lyycs0jgz95tm9rgzpj86gh9l8ym5esnmqy"
]

module.exports = {
  mockParticipantOut,
  mockUtxos,
  mockOutputAddrs
}
