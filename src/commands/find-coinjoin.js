/*
  Queries a peer-to-peer database to retrieve a list of CoinJoin servers
  available to connect to.
*/

"use strict"

const rp = require("request-promise")

const Network = require("ccoinjoin-network")
//const Network = require("../../../ccoinjoin-network")
const network = new Network()

const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

const { Command, flags } = require("@oclif/command")

class FindCoinJoin extends Command {
  async run() {
    const { flags } = this.parse(FindCoinJoin)

    this.findServers()
  }

  async findServers() {
    const globalThis = this

    try {
      const options = {
        method: "GET",
        uri: `http://coinjoin.christroutner.com:5000/ipfsid`,
        resolveWithFullResponse: true,
        json: true
      }

      const result = await rp(options)
      //console.log(`ipfs ID: ${util.inspect(result.body.ipfsid)}`)
      const ipfsid = result.body.ipfsid
      const orbitAddr = result.body.orbitAddr

      const centralServer = `/dns4/coinjoin.christroutner.com/tcp/4002/ipfs/${ipfsid}`
      network.bootstrap.push(centralServer)

      console.log(`network.bootstrap: ${util.inspect(network.bootstrap)}`)

      // Connect to the IPFS network and subscribe to the DB.
      await network.connectToIPFS()

      //const res = await network.ipfs.swarm.connect(centralServer)
      //console.log(`res: ${util.inspect(res)}`)

      // Wait until some peers are connected
      let peers = 0
      do {
        await sleep(1000)
        const peersNow = await network.ipfs.swarm.peers()
        peers = peersNow.length
      } while (peers === 0)

      const db = await network.connectToOrbitDB(orbitAddr)

      const latest = await network.readDB()
      console.log(`latest: ${util.inspect(latest)}`)

      setInterval(async function() {
        const peers = await network.ipfs.swarm.peers()
        console.log(`peers: ${peers.length}`)

        const latest = await network.readDB()
        console.log(`latest: ${util.inspect(latest)}`)
      }, 1000 * 30)
    } catch (err) {
      console.log(`Error in findServers(): `, err)
    }
  }
}

FindCoinJoin.description = `List existing wallets.`

FindCoinJoin.flags = {
  //testnet: flags.boolean({ char: "t", description: "Create a testnet wallet" }),
  //name: flags.string({ char: "n", description: "Name of wallet" })
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

module.exports = FindCoinJoin
