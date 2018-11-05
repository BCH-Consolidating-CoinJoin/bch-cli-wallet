bch-cli-wallet
========

This is a prototype Bitcoin Cash (BCH) wallet that runs on the command line. This
project has the following goals:
- Create a code base for a wallet that is easily forkable and extensible by JavaScript developers.
- Code an HD wallet that follows [these privacy best practices](http://bitcoinism.blogspot.com/2013/07/reclaiming-financial-privacy-with-hd.html)
- Include an interface for a CoinJoin or [equivalent service described here](https://gist.github.com/christroutner/457b99b8033fdea5ae565687e6360323)

If you want a wallet with a graphical user interface, check out
[Badger Wallet](http://badgerwallet.cash/). BCH functionality is
implemented in both wallets with [BITBOX](https://developer.bitcoin.com/bitbox), and the command
line interface for this project is built with [oclif](https://oclif.io)


[![Greenkeeper badge](https://badges.greenkeeper.io/christroutner/bch-cli-wallet.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/christroutner/bch-cli-wallet.svg?branch=master)](https://travis-ci.org/christroutner/bch-cli-wallet)

[![Coverage Status](https://coveralls.io/repos/github/christroutner/bch-cli-wallet/badge.svg?branch=unstable)](https://coveralls.io/github/christroutner/bch-cli-wallet?branch=unstable)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bch-cli-wallet
$ bch-cli-wallet COMMAND
running command...
$ bch-cli-wallet (-v|--version|version)
bch-cli-wallet/1.0.1 linux-x64 node-v10.11.0
$ bch-cli-wallet --help [COMMAND]
USAGE
  $ bch-cli-wallet COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bch-cli-wallet create-wallet`](#bch-cli-wallet-create-wallet)
* [`bch-cli-wallet get-address`](#bch-cli-wallet-get-address)
* [`bch-cli-wallet hello`](#bch-cli-wallet-hello)
* [`bch-cli-wallet help [COMMAND]`](#bch-cli-wallet-help-command)
* [`bch-cli-wallet list-wallets`](#bch-cli-wallet-list-wallets)
* [`bch-cli-wallet send`](#bch-cli-wallet-send)
* [`bch-cli-wallet send-all`](#bch-cli-wallet-send-all)
* [`bch-cli-wallet update-balances`](#bch-cli-wallet-update-balances)

## `bch-cli-wallet create-wallet`

Generate a new HD Wallet.

```
USAGE
  $ bch-cli-wallet create-wallet

OPTIONS
  -n, --name=name  Name of wallet
  -t, --testnet    Create a testnet wallet
```

_See code: [src/commands/create-wallet.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/create-wallet.js)_

## `bch-cli-wallet get-address`

Generate a new address to recieve BCH.

```
USAGE
  $ bch-cli-wallet get-address

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/get-address.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/get-address.js)_

## `bch-cli-wallet hello`

Describe the command here

```
USAGE
  $ bch-cli-wallet hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/hello.js)_

## `bch-cli-wallet help [COMMAND]`

display help for bch-cli-wallet

```
USAGE
  $ bch-cli-wallet help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_

## `bch-cli-wallet list-wallets`

List existing wallets.

```
USAGE
  $ bch-cli-wallet list-wallets
```

_See code: [src/commands/list-wallets.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/list-wallets.js)_

## `bch-cli-wallet send`

Send an amount of BCH

```
USAGE
  $ bch-cli-wallet send

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -b, --bch=bch            Quantity in BCH
  -n, --name=name          Name of wallet
```

_See code: [src/commands/send.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/send.js)_

## `bch-cli-wallet send-all`

Send all BCH in a wallet to another address. This method has a negative impact

```
USAGE
  $ bch-cli-wallet send-all

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -n, --name=name          Name of wallet

DESCRIPTION
  Send all BCH in a wallet to another address. This method has a negative impact
  on privacy by linking all addresses in a wallet.
```

_See code: [src/commands/send-all.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/send-all.js)_

## `bch-cli-wallet update-balances`

Poll the network and update the balances of the wallet.

```
USAGE
  $ bch-cli-wallet update-balances

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/update-balances.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/update-balances.js)_
<!-- commandsstop -->
* [`bch-cli-wallet create-wallet`](#bch-cli-wallet-create-wallet)
* [`bch-cli-wallet get-address`](#bch-cli-wallet-get-address)
* [`bch-cli-wallet hello`](#bch-cli-wallet-hello)
* [`bch-cli-wallet help [COMMAND]`](#bch-cli-wallet-help-command)
* [`bch-cli-wallet list-wallets`](#bch-cli-wallet-list-wallets)
* [`bch-cli-wallet send`](#bch-cli-wallet-send)
* [`bch-cli-wallet update-balances`](#bch-cli-wallet-update-balances)

## `bch-cli-wallet create-wallet`

Generate a new HD Wallet.

```
USAGE
  $ bch-cli-wallet create-wallet

OPTIONS
  -n, --name=name  Name of wallet
  -t, --testnet    Create a testnet wallet
```

_See code: [src/commands/create-wallet.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/create-wallet.js)_

## `bch-cli-wallet get-address`

Generate a new address to recieve BCH.

```
USAGE
  $ bch-cli-wallet get-address

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/get-address.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/get-address.js)_

## `bch-cli-wallet hello`

Describe the command here

```
USAGE
  $ bch-cli-wallet hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/hello.js)_

## `bch-cli-wallet help [COMMAND]`

display help for bch-cli-wallet

```
USAGE
  $ bch-cli-wallet help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_

## `bch-cli-wallet list-wallets`

List existing wallets.

```
USAGE
  $ bch-cli-wallet list-wallets
```

_See code: [src/commands/list-wallets.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/list-wallets.js)_

## `bch-cli-wallet send`

Poll the network and update the balances of the wallet.

```
USAGE
  $ bch-cli-wallet send

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -b, --bch=bch            Quantity in BCH
  -n, --name=name          Name of wallet
```

_See code: [src/commands/send.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/send.js)_

## `bch-cli-wallet update-balances`

Poll the network and update the balances of the wallet.

```
USAGE
  $ bch-cli-wallet update-balances

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/update-balances.js](https://github.com/christroutner/bch-cli-wallet/blob/v1.0.1/src/commands/update-balances.js)_
<!-- commandsstop  -->
