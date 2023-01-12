# ChangeLogs

## Version 1.1.16

- :arrow_up: Packages for development are bumped
  - `@types/node` is bumped from 18.11.17 to 18.11.18
  - `@typescript-eslint/eslint-plugin` is bumped from 5.47.0 to 5.48.1
  - `@typescript-eslint/parser` is bumped from 5.47.0 to 5.48.1
  - `esbuild` is bumped from 0.16.10 to 0.16.17
  - `eslint` is bumped from 8.30.0 to 8.31.0
- :lock: Security update
  - `json5` is bumped from 2.2.0 to 2.2.2 by `npm audit fix`

## Version 1.1.15

- :green_heart: CI chore
  - `actions/checkout` is bumped from 2 to 3
  - `actions/setup-node` is bumped from 2 to 3
  - `actions/upload-artifact` is bumped from 2 to 3
  - CodeQL is installed
  - GitHub actions package ecosystem is added on Dependabot
  - Job to get the commit summary to create release is fixed
  - Job to publish the package is added
  - Node.js version 12.x and 17.x are unsupported
  - TravisCI has been purged
  - npm is made to be cached on setup Node.js
- :arrow_up: Packages for development are bumped
  - `@types/chai` is bumped from 4.3.0 to 4.3.4
  - `@types/mocha` is bumped from 9.0.0 to 10.0.1
  - `@types/node` is bumped from 17.0.1 to 18.11.17
  - `@typescript-eslint/eslint-plugin` is bumped from 5.7.0 to 5.47.0
  - `@typescript-eslint/parser` is bumped from 5.7.0 to 5.47.0
  - `chai` is bumped from 4.3.4 to 4.3.7
  - `esbuild` is bumped from 0.14.5 to 0.16.10
  - `eslint` is bumped from 8.5.0 to 8.30.0
  - `mocha` is bumped from 9.1.3 to 10.2.0
  - `ts-node` is bumped from 10.4.0 to 10.9.1
  - `typescript` is bumped from 4.5.4 to 4.9.4

## Version 1.1.14

- :hear_no_evil: '.eslintignore' is added
- :hear_no_evil: 'CONTRIBUTING.md' is added to '.npmignore'
- :see_no_evil: 'package-lock.json' is deleted from '.gitignore' to use cache on GitHub CI
- :robot: Dependabot is installed
- :arrow_up: Fetch upstream
- :building_construction: Migration from `terser` to `esbuild`
- :arrow_up: Packages for development are bumped
  - `@types/chai` is bumped from 4.2.22 to 4.3.0
  - `@types/node` is bumped from 16.11.7 to 17.0.1
  - `@typescript-eslint/eslint-plugin` is bumped from 8.2.0 to 8.5.0
  - `@typescript-eslint/parser` is bumped from 8.2.0 to 8.5.0
  - `eslint` is bumped from 8.2.0 to 8.5.0
  - `typescript` is bumped from 4.4.4 to 4.5.4
- :hammer: Scripts are updated
- :white_check_mark: Threshold of code coverage is modified
- :package: URL of the repository is simplified
- :green_heart: Workflows are updated
- :bug: Wrong path to assets is fixed

## Version 1.1.13

- :bug: Path to assets is fixed again

## Version 1.1.12

- :bug: Path to assets is fixed again

## Version 1.1.11

- :bug: Path to assets is fixed

## Version 1.1.10

- :green_heart: Make emojify passes the GitHub CI

## Version 1.1.9

- :memo: Badges are added
- :green_heart: Code coverage report is made to be retained on GitHub CI
- :memo: Logo of Travis CI is added to the badge
- :green_heart: Node.js version is updated for GitHub CI
- :arrow_up: Packages for development are updated
  - `@kei-g/chmod` is upgraded from 1.0.4 to 1.0.5
  - `@types/node` is upgraded from 16.11.6 to 16.11.7
  - `@typescript-eslint/eslint-plugin` is upgraded from 5.3.0 to 5.3.1
  - `@typescript-eslint/parser` is upgraded from 5.3.0 to 5.3.1

## Version 1.1.8

- :green_heart: Submodules are made to be checked out on GitHub CI
- :hammer: The missing 'emoji.json' file is placed to publish

## Version 1.1.7

- :building_construction: The migration to `esbuild` is reverted

## Version 1.1.6

- :arrow_up: Packages for development are updated
  - `@kei-g/chmod` is upgraded from 1.0.3 to 1.0.4
  - `@types/node` is upgraded from 16.11.1 to 16.11.6
  - `@typescript-eslint/eslint-plugin` is upgraded from 5.1.0 to 5.3.0
  - `@typescript-eslint/parser` is upgraded from 5.1.0 to 5.3.0
  - `esbuild` is upgraded from 0.13.8 to 0.13.12
  - `eslint` is upgraded from 8.0.1 to 8.2.0
  - `ts-node` is upgraded from 10.3.0 to 10.4.0
- :green_heart: Target branch is changed to 'main' on Travis CI
- :green_heart: Test on GitHub Action is added

## Version 1.1.5

- :arrow_up: Packages for development are updated
  - `@kei-g/chmod` is upgraded from 1.0.1 to 1.0.3
  - `@types/chai` is upgraded from 4.2.21 to 4.2.22
  - `@types/node` is upgraded from 16.7.5 to 16.11.1
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.29.3 to 5.1.0
  - `@typescript-eslint/parser` is upgraded from 4.29.3 to 5.1.0
  - `eslint` is upgraded from 7.32.0 to 8.0.1
  - `mocha` is upgraded from 9.1.1 to 9.1.3
  - `ts-node` is upgraded from 10.2.1 to 10.3.0
  - `typescript` is upgraded from 4.4.2 to 4.4.4
- :heavy_minus_sign: Unnecessary dependent module is deleted
  - `terser` is deleted
  - `uuid` is deleted

## Version 1.1.4

- :wrench: .editorconfig is updated
  - A section is added for .gitmodules
- :hear_no_evil: .npmignore is added
- :green_heart: .travis.yml is updated
  - ~/.npm directory is cached
  - Release tags are excepted
- :memo: Badges are relocated
- :memo: CHANGELOG.md is added
- :memo: CODE_OF_CONDUCT.md is added
- :zap: Capitalized alphabets are omitted as name of emojis
- :arrow_up: Dependent packages for development are updated
  - `@types/mocha` is upgraded from 8.2.3 to 9.1.1
  - `@types/node` is upgraded from 16.4.0 to 16.7.5
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.28.4 to 4.29.3
  - `@typescript-eslint/parser` is upgraded from 4.28.4 to 4.29.3
  - `eslint` is upgraded from 7.31.0 to 7.32.0
  - `mocha` is upgraded from 9.0.2 to 9.1.1
  - `ts-node` is upgraded from 10.1.0 to 10.2.1
  - `typescript` is upgraded from 4.3.5 to 4.4.2
- :heavy_plus_sign: New Dependent packages from development are added
  - `rimraf` is added
  - `uuid` is added
- :page_facing_up: LICENSE is updated
  - Copyright year is corrected
- :bug: Make it possible to accept plus-sign as name of emojis
- :green_heart: Node.js v15.x is removed from targets for Travis CI
- :mute: Redundant error messages after stdin/stdout has been closed are suppressed
- :green_heart: Target branches are limited only to 'main' for Travis CI
- :pencil2: Typo on catching error from stderr is corrected
- :zap: Unuse Array#includes
- :fire: package-lock.json is removed
- :hammer: package.json is updated
  - 'nyc' is added to coverage threshold

## Version 1.1.3

- :bug: Bugfix around occasionally uncaught exception
- :arrow_up: Dependent packages for development are updated
  - `@types/node` is upgraded from 16.3.3 to 16.4.0
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.28.3 to 4.28.4
  - `@typescript-eslint/parser` is upgraded from 4.28.3 to 4.28.4
- :children_crossing: Error texts are colorized
- :white_check_mark: Tests are updated
  - Coverage ratio is increased

## Version 1.1.2

- :bug: Bugfix around occasionally uncaught exception
- :white_check_mark: Coverage with `nyc`
- :arrows_clockwise: Earlier Node.js versions are supported
  - For v6.4.0 or later
    - Object rest properties are purged
  - For v6.0.0 or later
    - New command-line option, '--avoid-includes', is added
  - For v4.5.0 or later, and v5.10.0 or later
    - New command-line option, '--avoid-subarray', is added
    - Parenthesised left-hand-side assignments are removed
  - For v4.0.0 or later
    - New command-line option, '--avoid-buffer-alloc', is added
- :sparkles: New command-line option, '--verbose', is added
- :white_check_mark: `mocha` test suits are added

## Version 1.1.1

- :white_check_mark: A test to verify whether if `:tada:` is formatted correctly is added
- :medical_symbol: Trivial fix that affects only developper's environment
- :hammer: package.json is updated
  - Description about which nodejs version is supported is corrected

## Version 1.1.0

- :arrow_up: Dependent packages for development are updated
  - `eslint` is upgraded from 7.30.0 to 7.31.0
- :arrows_clockwise: Earlier Node.js versions are supported
  - Node.js earlier than version 15.0.0 are supported
    - `String#replaceAll` is unused
- :art: Limit width for each line less than 80
- :sparkles: New command-line argument is added
  - '-l' is supported as alias of '--list'
- :zap: Performance improvement
  - Efficiency in memory usage is improved
  - I/O with process.std{err,in,out} rather than `console`
- :memo: README.md is updated
  - TODO is updated
  - badges are moved to top
- :medical_symbol: Symbolic link is detected by `lstat`
- :wrench: tsconfig.json is updated
  - Indent by spaces

## Version 1.0.1

- :hear_no_evil: .gitmodules is modified
  - URL scheme of submodule is modified from 'ssh' to 'https'
- :construction_worker: .travis.yml is added
- :memo: README.md is updated
  - URLs of badges are modified
  - links for badges are modified
- :truck: Script file is moved to utils/
- :hammer: package.json is updated
  - 'files' is splitted from 'dist' into 'assets' and 'bin'
- :hammer: post-build.sh is modified
  - 'assets/emoji.json' is linked to 'node-emoji/lib/emoji.json'
  - 'bin/emojify.js' is tersed from 'build/emojify.js'

## Version 1.0.0

- :tada: Initial release
