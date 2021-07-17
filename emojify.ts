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
  value: '',
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
  }
}

const source = 'assets/emoji.json'
const assetPath = `${__dirname}/${source}`
const path = fs.lstatSync(assetPath).isSymbolicLink
  ? fs.readlinkSync(assetPath)
  : `../${source}`
fs.readFile(`${__dirname}/${path}`, {}, (err: NodeJS.ErrnoException, data: Buffer) => {
  if (err) {
    console.error(err.message)
    process.exit(1)
  }
  const dictionary = JSON.parse(data.toString('utf8')) as Record<string, string>
  fs.readFile('/dev/stdin', {}, (err: NodeJS.ErrnoException, data: Buffer) => {
    if (err) {
      console.error(err.message)
      process.exit(1)
    }
    context.value = data.toString(context.charset)
    for (const name in dictionary) {
      const re = new RegExp(`\\:${name}\\:`, 'g')
      const code = dictionary[name]
      context.value = context.value.replaceAll(re, code)
    }
    fs.writeFile('/dev/stdout', Buffer.from(context.value), {}, () => process.exit(0))
  })
})
