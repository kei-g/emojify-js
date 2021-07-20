# Emojify [![License](https://img.shields.io/github/license/kei-g/emojify-js)](https://opensource.org/licenses/BSD-3-Clause) [![Libraries.io dependency status for latest release, scoped npm package](https://img.shields.io/librariesio/release/npm/@kei-g/emojify)](https://www.npmjs.com/package/kei-g/emojify?activeTab=dependencies) [![Travis CI](https://img.shields.io/travis/com/kei-g/emojify-js?logo=travis&style=flat)](https://www.travis-ci.com/github/kei-g/emojify-js) [![npm (scoped)](https://img.shields.io/npm/v/@kei-g/emojify?logo=npm&style=flat)](https://www.npmjs.com/package/@kei-g/emojify)

[![npms.io (maintenance)](https://img.shields.io/npms-io/maintenance-score/@kei-g/emojify)](https://npms.io/search?q=%40kei-g%2Femojify) [![npms.io (quality)](https://img.shields.io/npms-io/quality-score/@kei-g/emojify)](https://npms.io/search?q=%40kei-g%2Femojify)

Emojify - a text formatter for `:emoji:` style

## Installation

```shell
npm i @kei-g/emojify -g
```

## Usage

To format emojis simply, then you'll see :star: Hello world :tada:,

```shell
echo :star: Hello world :tada: | emojify
```

And to see available emojis list,

```shell
emojify -l
```

### emojify with git

To see emojified git logs,

```shell
mkdir play-with-emojify
cd play-with-emojify
git init
touch .gitkeep
git add .
git commit -m ":tada: Initial commit"
git log --color | emojify
```

To configure `git` to use `emojify` as pager; for example, on :penguin: linux,

```shell
git config --global core.pager 'emojify | less -R'
```

## TODO

- features
  - customizable dictionary of emojis
- quality
  - coverage
  - more test cases
