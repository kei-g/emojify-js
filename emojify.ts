import * as fs from 'fs'

function buildDictionaryFrom(data: Buffer): Record<string, Buffer> {
  const context = {} as {
    index?: number,
    name?: string,
    prev?: number,
  }
  const dict = {} as Record<string, Buffer>
  try {
    for (let i = 0; i < data.byteLength; i++) {
      const c = data[i]
      switch (c) {
        case CLOSE_BRACE:
          if (context.name || context.prev !== DOUBLE_QUOTE)
            throw `Invalid close brace at ${i}`
          return dict
        case COLON:
          if (context.index || !context.name || context.prev !== DOUBLE_QUOTE)
            throw `Invalid colon at ${i}`
          break
        case COMMA:
          if (context.index || context.name || context.prev !== DOUBLE_QUOTE)
            throw `Invalid comma at ${i}`
          break
        case DOUBLE_QUOTE:
          switch (context.prev) {
            case CLOSE_BRACE:
            case DOUBLE_QUOTE:
              throw `Invalid double quote at ${i}`
            case COLON:
              if (context.index || !context.name)
                throw `Invalid double quote at ${i}`
              context.index = i + 1
              break
            case COMMA:
            case OPEN_BRACE:
              if (context.index || context.name)
                throw `Invalid double quote at ${i}`
              context.index = i + 1
              break
            default:
              if (!context.index)
                throw `Invalid double quote at ${i}`
              if (context.name) {
                dict[context.name] = data.subarray(context.index, i)
                delete context.name
              }
              else
                context.name = data.subarray(context.index, i).toString()
              delete context.index
              break
          }
          break
        case OPEN_BRACE:
          if (context.index || context.name || context.prev)
            throw `Invalid open brace at ${i}`
          break
        default:
          break
      }
      context.prev = c
    }
    process.stderr.write('\u001b[31mNo close brace found\u001b[m\n')
  }
  catch (error) {
    process.stderr.write(`\u001b[31m${error}\u001b[m\n`)
  }
  return dict
}

function emojify(data: Buffer, dict: Record<string, Buffer>): void {
  const context = {} as { index?: number, preserved?: true }
  const flush = (end?: number) => {
    if (context.preserved) {
      delete context.preserved
      process.stdout.write(data.subarray(context.index, end))
    }
    delete context.index
  }
  for (let i = 0; i < data.byteLength; i++)
    if (data[i] === COLON) {
      for (let j = i + 1; j < data.byteLength; j++) {
        const c = data[j]
        if (c === COLON) {
          const name = data.subarray(i + 1, j).toString()
          const code = dict[name]
          process.stdout.cork()
          flush(i)
          process.stdout.write(code ?? `:${name}:`)
          process.stdout.uncork()
          i = j
        }
        else if (isNumAlphaOr(c, HYPHEN, UNDERSCORE))
          continue
        else
          break
      }
    }
    else if (!context.preserved)
      [context.index, context.preserved] = [i, true]
  flush()
}

function isNumAlphaOr(c: number, ...or: number[]): boolean {
  if (0x30 <= c && c <= 0x39)
    return true
  if (0x41 <= c && c <= 0x5a)
    return true
  if (0x61 <= c && c <= 0x7a)
    return true
  return or.includes(c)
}

const CLOSE_BRACE = '}'.codePointAt(0)
const COLON = ':'.codePointAt(0)
const COMMA = ','.codePointAt(0)
const DOUBLE_QUOTE = '"'.codePointAt(0)
const HYPHEN = '-'.codePointAt(0)
const OPEN_BRACE = '{'.codePointAt(0)
const UNDERSCORE = '_'.codePointAt(0)

const context = {
  index: 0,
  operation: null as null | 'list'
}

for (; context.index < process.argv.length; context.index++) {
  const argv = process.argv[context.index]
  switch (argv) {
    case '-l':
    case '--list':
      context.operation = 'list'
      break
  }
}

const source = 'assets/emoji.json'
const assetPath = `${__dirname}/${source}`
fs.lstat(assetPath, (err: NodeJS.ErrnoException, stats: fs.Stats) => {
  const path = err ? `../${source}` : stats.isSymbolicLink
    ? fs.readlinkSync(assetPath)
    : `../${source}`
  fs.readFile(`${__dirname}/${path}`, {},
    (err: NodeJS.ErrnoException, data: Buffer) => {
      if (err) {
        console.error(err.message)
        process.exit(1)
      }
      const dict = buildDictionaryFrom(data)
      if (context.operation === 'list') {
        for (const name in dict) {
          process.stdout.write(dict[name])
          process.stdout.write(`\t:${name}:\n`)
        }
        process.exit(0)
      }
      process.stdin.on('data', (data: Buffer) => emojify(data, dict))
      process.stdin.on('close', (hadError: boolean) =>
        process.exit(hadError ? 1 : 0)
      )
      process.stdin.on('end', () =>
        process.exit(0)
      )
      process.stdin.on('error', (err: Error) =>
        process.stderr.write(err?.message ?? '')
      )
    })
})
