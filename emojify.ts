import * as fs from 'fs'

const supportedEncodings = [
  'ascii',
  'utf8',
  'utf-8',
  'utf16le',
  'ucs2',
  'ucs-2',
  'base64',
  'base64url',
  'latin1',
  'binary',
  'hex',
]

const context = {
  charset: 'utf8' as BufferEncoding,
  index: 0,
  operation: null as null | 'list'
}

for (; context.index < process.argv.length; context.index++) {
  const argv = process.argv[context.index]
  switch (argv) {
    case '-c':
    case '--charset':
      if (context.index + 1 < process.argv.length) {
        const charset = process.argv[++context.index]
        if (supportedEncodings.includes(charset))
          context.charset = argv as BufferEncoding
        else {
          console.error(`Unsupported charset, ${charset}`)
          process.exit(1)
        }
      }
      else {
        console.error(`No charset has been specified with ${argv}`)
        process.exit(1)
      }
      break
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
      const json = data.toString('utf8')
      const dictionary = JSON.parse(json) as Record<string, string>
      if (context.operation === 'list') {
        for (const name in dictionary)
          process.stdout.write(`${dictionary[name]}=:${name}:\n`)
        process.exit(0)
      }
      const list = [] as { code: string, re: RegExp }[]
      for (const name in dictionary)
        list.push({
          code: dictionary[name],
          re: new RegExp(`\\:${name}\\:`, 'g'),
        })
      process.stdin.on('data', (buffer: Buffer) => {
        let text = buffer.toString(context.charset)
        for (const item of list)
          text = text.replaceAll(item.re, item.code)
        process.stdout.cork()
        process.stdout.write(text)
        process.stdout.uncork()
      })
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
