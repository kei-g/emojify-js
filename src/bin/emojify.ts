#!/usr/bin/env node

import { buildDictionaryFrom, createContext, emojify, loadAssets } from '../'

const reportError = (error?: Error) => {
  if (error)
    process.stderr.write(`\x1b[31m${error.message}\x1b[m\n`)
}

process.stderr.on('error', () => process.exit(0))
process.stdin.on('error', () => process.exit(0))
process.stdout.on('error', () => process.exit(0))

const main = async () => {
  const data = await loadAssets()
  if (data instanceof Error) {
    reportError(data)
    process.exit(1)
  }
  const context = createContext(process.argv)
  const dict = buildDictionaryFrom(context, data)
  if (context.operation === 'list') {
    for (const name in dict) {
      process.stdout.write(dict[name], reportError)
      process.stdout.write(`\t:${name}:\n`, reportError)
    }
    process.exit(0)
  }
  process.stdin.on('data', (data: Buffer) =>
    emojify({ context, data, destination: process.stdout, dictionary: dict })
  )
  process.stdin.on('close', (hadError: boolean) =>
    process.exit(hadError ? 1 : 0)
  )
  process.stdin.on('end', () =>
    process.exit(0)
  )
}

main()
