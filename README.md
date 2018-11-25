ccoinjoin-wallet
========
`ccoinjoin-wallet` is a fork of [`bch-cli-wallet`](https://github.com/christroutner/bch-cli-wallet) that implements the [Consolidating CoinJoin](https://gist.github.com/christroutner/457b99b8033fdea5ae565687e6360323) protocol. To see a demo, and learn more about Bitcoin privacy, [watch this YouTube video](https://www.youtube.com/watch?v=LqqRR4Kfr-M).

This wallet is under active development, as the Consolidating CoinJoin implementation moves to a peer-to-peer model.

[![Greenkeeper badge](https://badges.greenkeeper.io/BCH-Consolidating-CoinJoin/ccoinjoin-wallet.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/BCH-Consolidating-CoinJoin/ccoinjoin-wallet.svg?branch=master)](https://travis-ci.org/BCH-Consolidating-CoinJoin/ccoinjoin-wallet)

[![Coverage Status](https://coveralls.io/repos/github/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/badge.svg?branch=unstable)](https://coveralls.io/github/BCH-Consolidating-CoinJoin/ccoinjoin-wallet?branch=unstable)

[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g ccoinjoin-wallet
$ ccoinjoin-wallet COMMAND
running command...
$ ccoinjoin-wallet (-v|--version|version)
ccoinjoin-wallet/1.0.0 linux-x64 node-v10.11.0
$ ccoinjoin-wallet --help [COMMAND]
USAGE
  $ ccoinjoin-wallet COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`ccoinjoin-wallet coinjoin`](#ccoinjoin-wallet-coinjoin)
* [`ccoinjoin-wallet create-wallet`](#ccoinjoin-wallet-create-wallet)
* [`ccoinjoin-wallet find-coinjoin`](#ccoinjoin-wallet-find-coinjoin)
* [`ccoinjoin-wallet get-address`](#ccoinjoin-wallet-get-address)
* [`ccoinjoin-wallet hello`](#ccoinjoin-wallet-hello)
* [`ccoinjoin-wallet help [COMMAND]`](#ccoinjoin-wallet-help-command)
* [`ccoinjoin-wallet list-wallets`](#ccoinjoin-wallet-list-wallets)
* [`ccoinjoin-wallet remove-wallet`](#ccoinjoin-wallet-remove-wallet)
* [`ccoinjoin-wallet send`](#ccoinjoin-wallet-send)
* [`ccoinjoin-wallet send-all`](#ccoinjoin-wallet-send-all)
* [`ccoinjoin-wallet update-balances`](#ccoinjoin-wallet-update-balances)

## `ccoinjoin-wallet coinjoin`

Send all BCH in a wallet to a Consolidating CoinJoin server to anonymize it.

```
USAGE
  $ ccoinjoin-wallet coinjoin

OPTIONS
  -n, --name=name      Name of wallet
  -s, --server=server  Consolidating CoinJoin Server URL

DESCRIPTION
  Send all BCH in a wallet to a Consolidating CoinJoin server to anonymize it.
  When the CoinJoin is complete, standardized amounts of BCH
  will be sent back to this wallet.
```

_See code: [src/commands/coinjoin.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/coinjoin.js)_

## `ccoinjoin-wallet create-wallet`

Generate a new HD Wallet.

```
USAGE
  $ ccoinjoin-wallet create-wallet

OPTIONS
  -n, --name=name  Name of wallet
  -t, --testnet    Create a testnet wallet
```

_See code: [src/commands/create-wallet.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/create-wallet.js)_

## `ccoinjoin-wallet find-coinjoin`

List existing wallets.

```
USAGE
  $ ccoinjoin-wallet find-coinjoin
```

_See code: [src/commands/find-coinjoin.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/find-coinjoin.js)_

## `ccoinjoin-wallet get-address`

Generate a new address to recieve BCH.

```
USAGE
  $ ccoinjoin-wallet get-address

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/get-address.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/get-address.js)_

## `ccoinjoin-wallet hello`

Example command from oclif

```
USAGE
  $ ccoinjoin-wallet hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Leaving it here for future reference in development.
```

_See code: [src/commands/hello.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/hello.js)_

## `ccoinjoin-wallet help [COMMAND]`

display help for ccoinjoin-wallet

```
USAGE
  $ ccoinjoin-wallet help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.4/src/commands/help.ts)_

## `ccoinjoin-wallet list-wallets`

List existing wallets.

```
USAGE
  $ ccoinjoin-wallet list-wallets
```

_See code: [src/commands/list-wallets.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/list-wallets.js)_

## `ccoinjoin-wallet remove-wallet`

Remove an existing wallet.

```
USAGE
  $ ccoinjoin-wallet remove-wallet

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/remove-wallet.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/remove-wallet.js)_

## `ccoinjoin-wallet send`

Send an amount of BCH

```
USAGE
  $ ccoinjoin-wallet send

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -b, --bch=bch            Quantity in BCH
  -n, --name=name          Name of wallet
```

_See code: [src/commands/send.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/send.js)_

## `ccoinjoin-wallet send-all`

Send all BCH in a wallet to another address. **Degrades Privacy**

```
USAGE
  $ ccoinjoin-wallet send-all

OPTIONS
  -a, --sendAddr=sendAddr  Cash address to send to
  -n, --name=name          Name of wallet

DESCRIPTION
  Send all BCH in a wallet to another address. **Degrades Privacy**
  This method has a negative impact on privacy by linking all addresses in a
  wallet. If privacy of a concern, CoinJoin should be used.
  This is a good article describing the privacy concerns:
  https://bit.ly/2TnhdVc
```

_See code: [src/commands/send-all.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/send-all.js)_

## `ccoinjoin-wallet update-balances`

Poll the network and update the balances of the wallet.

```
USAGE
  $ ccoinjoin-wallet update-balances

OPTIONS
  -n, --name=name  Name of wallet
```

_See code: [src/commands/update-balances.js](https://github.com/BCH-Consolidating-CoinJoin/ccoinjoin-wallet/blob/v1.0.0/src/commands/update-balances.js)_
<!-- commandsstop -->
