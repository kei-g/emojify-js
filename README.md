# Emojify [![licence][license-image]][license-url] [![npm][npm-image]][npm-url]

[![dependency][dependency-image]][dependency-url] [![maintenance][maintenance-image]][npmsio-url] [![quality][quality-image]][npmsio-url] [![travis][travis-image]][travis-url]

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
  - provide a method for escaped colons
- quality
  - coverage
    - failure cases of parsing emojis' dictionary

[dependency-image]:https://img.shields.io/librariesio/release/npm/@kei-g/emojify?logo=nodedotjs
[dependency-url]:https://npmjs.com/package/@kei-g/emojify?activeTab=dependencies
[license-image]:https://img.shields.io/github/license/kei-g/emojify-js
[license-url]:https://opensource.org/licenses/BSD-3-Clause
[maintenance-image]:https://img.shields.io/npms-io/maintenance-score/@kei-g/emojify?logo=npm
[npm-image]:https://img.shields.io/npm/v/@kei-g/emojify?logo=npm
[npm-url]:https://npmjs.com/@kei-g/emojify
[npmsio-url]:https://npms.io/search?q=%40kei-g%2Femojify
[quality-image]:https://img.shields.io/npms-io/quality-score/@kei-g/emojify?logo=npm
[travis-image]:https://img.shields.io/travis/com/kei-g/emojify-js/main.svg?logo=travis
[travis-url]:https://app.travis-ci.com/github/kei-g/emojify-js
