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

module.exports = {
  mockParticipantOut
}
