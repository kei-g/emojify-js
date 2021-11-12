#!/usr/bin/env node

import { buildDictionaryFrom, createContext, emojify, loadAssets } from '../'

const reportError = (err?: unknown) => {
  if (!err)
    return
  try {
    const msg = typeof err === 'string'
      ? err
      : err instanceof Buffer
        ? err.toString()
        : err instanceof Error && err.message
          ? err.message
          : err instanceof Uint8Array
            ? Buffer.from(err).toString()
            : null
    if (msg && typeof msg === 'string')
      process.stderr.write(`\u001b[31m${msg}\u001b[m\n`)
    else
      console.error(err)
  }
  catch (err: unknown) {
    process.exit(1)
  }
}

process.stderr.on('error', () => process.exit(0))
process.stdin.on('error', () => process.exit(0))
process.stdout.on('error', () => process.exit(0))

loadAssets((err?: NodeJS.ErrnoException, data?: Buffer) => {
  if (err) {
    reportError(err)
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
})
