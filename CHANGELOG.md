# ChangeLogs

## Version 1.1.4

- :wrench: .editorconfig is updated
  - A section is added for .gitmodules
- :hear_no_evil: .npmignore is added
- :green_heart: .travis.yml is updated
  - ~/.npm directory is cached
  - Release tags are excepted
- :memo: CHANGELOG.md is added
- :memo: CODE_OF_CONDUCT.md is added
- :zap: Capitalized alphabets are omitted as name of emojis
- :arrow_up: Dependent packages for development are updated
  - `@types/mocha` is upgraded from 8.2.3 to 9.0.0
  - `@types/node` is upgraded from 16.4.0 to 16.6.1
  - `@typescript-eslint/eslint-plugin` is upgraded from 4.28.4 to 4.29.2
  - `@typescript-eslint/parser` is upgraded from 4.28.4 to 4.29.2
  - `eslint` is upgraded from 7.31.0 to 7.32.0
  - `mocha` is upgraded from 9.0.2 to 9.0.3
  - `ts-node` is upgraded from 10.1.0 to 10.2.0
- :page_facing_up: LICENSE is updated
  - Copyright year is corrected
- :bug: Make it possible to accept plus-sign as name of emojis
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
