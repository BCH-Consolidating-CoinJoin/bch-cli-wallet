/*
  Queries a peer-to-peer database to retrieve a list of CoinJoin servers
  available to connect to.
*/

"use strict"

const IPFS = require("ipfs")
const OrbitDB = require("orbit-db")

const util = require("util")
util.inspect.defaultOptions = {
  showHidden: true,
  colors: true,
  depth: 1
}

// OrbitDB uses Pubsub which is an experimental feature
// and need to be turned on manually.
// Note that these options need to be passed to IPFS in
// all examples in this document even if not specified so.
const ipfsOptions = {
  start: true,
  EXPERIMENTAL: {
    pubsub: true
  }
}

const { Command, flags } = require("@oclif/command")

class FindCoinJoin extends Command {
  async run() {
    const { flags } = this.parse(FindCoinJoin)

    this.findServers()
  }

  findServers() {
    const globalThis = this

    try {
      // Create an IPFS instance.
      const ipfs = new IPFS(ipfsOptions)

      ipfs.on("error", err => console.error(err))

      ipfs.bootstrap.add(
        "/ip4/162.243.158.213/tcp/4002/ipfs/QmQLcCWKuxsMkRt5DJkcSw361iNLikjEBMEj6ovR6pwAb5"
      )

      // Once IPFS is ready, initialize the DB.
      ipfs.on("ready", async () => {
        try {
          console.log(`IPFS is ready.`)

          const access = {
            // Give write access to everyone
            write: ["*"]
          }

          // Create OrbitDB instance
          const orbitdb = new OrbitDB(ipfs)

          const db = await orbitdb.eventlog("ccoinjoin", access)
          await db.load() // Load any saved state from disk.

          console.log(`IPFS address: ${db.address}`)

          // List bootstrap peers, to verify it's been updated with the bootstrap list.
          //const list = await ipfs.bootstrap.list()
          //console.log(`list: ${util.inspect(list)}`)

          console.log(`Curent list of servers:`)
          await getLatest(db)

          // Debugging: Display a notification whenever the DB is updated by another
          // node.
          console.log(`Waiting 30 seconds for P2P DB to send updates...`)
          db.events.on("replicated", () => {
            console.log(`...new entries found. Updating server list.`)

            // Get the latest servers after the DB has replicated.
            getLatest(db)
          })

          setTimeout(function() {
            console.log(`Exiting.`)
            //globalThis.exit(1)
            process.exit()
          }, 1000 * 30)
        } catch (err) {
          console.error(`Error trying to initialize OrbitDB: `, err)
          process.exit()
        }
      })
    } catch (err) {
      console.log(`Error in findServers(): `, err)
    }
  }
}

async function getLatest(db) {
  try {
    // latest[4] is the latest entry
    const latest = db.iterator({ limit: 5 }).collect()

    //console.log(`latest: ${JSON.stringify(latest, null, 2)}`)
    /*
    console.log(` `)
    console.log(`latest 3 servers:`)
    console.log(`${util.inspect(latest[0].payload.value)}`)
    console.log(`${util.inspect(latest[1].payload.value)}`)
    console.log(`${util.inspect(latest[2].payload.value)}`)
*/
    const servers = []
    for (var i = 0; i < latest.length; i++)
      servers.push(latest[i].payload.value)

    console.log(`servers: ${JSON.stringify(servers, null, 2)}`)
  } catch (err) {
    console.log(`Error in getLatest(): `, err)
  }
}

FindCoinJoin.description = `List existing wallets.`

FindCoinJoin.flags = {
  //testnet: flags.boolean({ char: "t", description: "Create a testnet wallet" }),
  //name: flags.string({ char: "n", description: "Name of wallet" })
}

module.exports = FindCoinJoin
