# Emojify [![licence][license-image]][license-url] [![npm][npm-image]][npm-url]

[![coverage][nyc-cov-image]][github-url] [![dependency][dependency-image]][dependency-url] [![maintenance][maintenance-image]][npmsio-url] [![quality][quality-image]][npmsio-url]

Emojify - a text formatter for `:emoji:` style

## CI Status

| Target | Status |
|-|-|
| Build | [![GitHub CI (Build)][github-build-image]][github-build-url] |
| CodeQL | [![GitHub CI (CodeQL)][github-codeql-image]][github-codeql-url] |
| Coverage | [![GitHub CI (Coverage)][github-coverage-image]][github-coverage-url] |

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

## License

The scripts and documentation in this project are released under the [BSD-3-Clause License][license-url]

## Contributions

Contributions are welcome! See [Contributor's Guide](https://github.com/kei-g/emojify-js/blob/main/CONTRIBUTING.md)

### Code of Conduct

:clap: Be nice. See [our code of conduct](https://github.com/kei-g/emojify-js/blob/main/CODE_OF_CONDUCT.md)

[dependency-image]:https://img.shields.io/librariesio/release/npm/@kei-g/emojify?logo=nodedotjs
[dependency-url]:https://npmjs.com/package/@kei-g/emojify?activeTab=dependencies
[github-build-image]:https://github.com/kei-g/emojify-js/actions/workflows/build.yml/badge.svg?query=branch%3Amain
[github-build-url]:https://github.com/kei-g/emojify-js/actions/workflows/build.yml?query=branch%3Amain
[github-codeql-image]:https://github.com/kei-g/emojify-js/actions/workflows/codeql.yml/badge.svg?query=branch%3Amain
[github-codeql-url]:https://github.com/kei-g/emojify-js/actions/workflows/codeql.yml?query=branch%3Amain
[github-coverage-image]:https://github.com/kei-g/emojify-js/actions/workflows/coverage.yml/badge.svg?query=branch%3Amain
[github-coverage-url]:https://github.com/kei-g/emojify-js/actions/workflows/coverage.yml?query=branch%3Amain
[github-url]:https://github.com/kei-g/emojify-js
[license-image]:https://img.shields.io/github/license/kei-g/emojify-js
[license-url]:https://opensource.org/licenses/BSD-3-Clause
[maintenance-image]:https://img.shields.io/npms-io/maintenance-score/@kei-g/emojify?logo=npm
[npm-image]:https://img.shields.io/npm/v/@kei-g/emojify?logo=npm
[npm-url]:https://npmjs.com/@kei-g/emojify
[npmsio-url]:https://npms.io/search?q=%40kei-g%2Femojify
[nyc-cov-image]:https://img.shields.io/nycrc/kei-g/emojify-js?config=.nycrc.json&label=coverage&logo=mocha
[quality-image]:https://img.shields.io/npms-io/quality-score/@kei-g/emojify?logo=npm
