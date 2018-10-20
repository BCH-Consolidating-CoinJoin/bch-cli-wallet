// const BB = require('bitbox-sdk/lib/bitbox-sdk').default
// const BITBOX = new BB({ restURL: `https://trest.bitcoin.com/v1/` })
// const BITBOX = new BB({ restURL: `http://localhost:3000/v1/` })
// const BITBOX = new BB({ restURL: `http://decatur.hopto.org:3003/v1/` })
// const BITBOX = new BB({ restURL: `http://192.168.0.13:3003/v1/` })

const {Command, flags} = require('@oclif/command')

class CreateWallet extends Command {
  async run() {
    const {flags} = this.parse(CreateWallet)
    // const name = flags.name || 'world'
    // this.log(`hello ${name} from ./src/commands/hello.js`)

    const testnet = flags.testnet
    await createWallet(testnet)
  }
}

CreateWallet.description = `Generate a new HD Wallet. Use flag -t to generate
a testnet wallet.
`

CreateWallet.flags = {
  testnet: flags.string({char: 't', description: 'Create a testnet wallet'}),
}

async function createWallet(testnet) {
  console.log('this is the createWallet function.')
  console.log(`testnet is ${testnet}`)
}

module.exports = CreateWallet
