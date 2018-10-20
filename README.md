bch-cli-wallet
========

[![Greenkeeper badge](https://badges.greenkeeper.io/christroutner/bch-cli-wallet.svg)](https://greenkeeper.io/)

[![Build Status](https://travis-ci.org/christroutner/bch-cli-wallet.svg?branch=master)](https://travis-ci.org/christroutner/bch-cli-wallet)

[![Coverage Status](https://coveralls.io/repos/github/christroutner/bch-cli-wallet/badge.svg?branch=unstable)](https://coveralls.io/github/christroutner/bch-cli-wallet?branch=unstable)

This is a prototype Bitcoin Cash (BCH) wallet that runs on the command line. This
project has the following goals:
- Create a code base for a wallet that is easily forkable and extensible by JavaScript developers.
- Code an HD wallet that follows [these privacy best practices](http://bitcoinism.blogspot.com/2013/07/reclaiming-financial-privacy-with-hd.html)
- Include an interface for a CoinJoin or [equivalent service described here](https://gist.github.com/christroutner/457b99b8033fdea5ae565687e6360323)

If you want a wallet with a graphical user interface, check out
[Badger Wallet](http://badgerwallet.cash/). BCH functionality is
implemented with [BITBOX](https://developer.bitcoin.com/bitbox) and the command
line interface is built with [oclif](https://oclif.io).


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
Ignore this section for now.

```sh-session
$ npm install -g mynewcli
$ mynewcli COMMAND
running command...
$ mynewcli (-v|--version|version)
mynewcli/0.0.0 linux-x64 node-v10.11.0
$ mynewcli --help [COMMAND]
USAGE
  $ mynewcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mynewcli hello`](#mynewcli-hello)
* [`mynewcli help [COMMAND]`](#mynewcli-help-command)

## `mynewcli hello`

Describe the command here

```
USAGE
  $ mynewcli hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/christroutner/mynewcli/blob/v0.0.0/src/commands/hello.js)_

## `mynewcli help [COMMAND]`

display help for mynewcli

```
USAGE
  $ mynewcli help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.3/src/commands/help.ts)_
<!-- commandsstop -->
