import { LoadAssetsError, buildDictionaryFrom, emojify, loadAssets, createContext } from '../emojify'
import { Transform } from 'stream'
import { describe, it } from 'mocha'
import { expect } from 'chai'

const options = [
  // for Node.js v6.4.0 or later
  [],

  // for Node.js v6.0.0 or later
  ['--avoid-includes'],

  // for Node.js v4.5.0 or later v4.x, v5.10.0 or later
  ['--avoid-includes', '--avoid-subarray'],

  // for Node.js v4.0.0 or later
  ['--avoid-buffer-alloc', '--avoid-includes', '--avoid-subarray']
]

for (const argv of options) {
  const context = createContext(argv)
  const dict = {} as Record<string, Buffer>
  describe(`Asset ${argv.join(', ')}`, () =>
    it('Is loadable?', () =>
      loadAssets((err: LoadAssetsError, data: Buffer) => {
        if (err)
          expect.fail(err.message)
        const d = buildDictionaryFrom(context, data)
        for (const name in d) {
          if (dict[name])
            expect.fail(`Duplicate key, ${name}`)
          const code = d[name]
          if (code instanceof Buffer)
            dict[name] = code
          else
            expect.fail(`Invalid data, ${code} for ${name}`)
        }
      })
    )
  )
  describe(`Can emojify single :tada: ${argv.join(', ')}`, () => {
    const emojified = [] as unknown[]
    emojify({
      context,
      data: Buffer.from(':tada:'),
      destination: new Transform({
        transform(chunk: unknown) {
          emojified.push(chunk)
        }
      }),
      dictionary: dict,
    })
    it('Correct?', () => expect(emojified[0].toString() === '🎉'))
  })
  describe(`Can omit :Not-Emoji: and ::, but :100: ${argv.join(', ')}`,
    () => {
      const emojified = [] as unknown[]
      emojify({
        context,
        data: Buffer.from(`Dictionary doesn't contain :Not-Emoji: and ::
but :100:\n`),
        destination: new Transform({
          transform(chunk: unknown) {
            emojified.push(chunk)
          }
        }),
        dictionary: dict,
      })
      it('Correct?', () => expect(emojified[0].toString() ===
        'Dictionary doesn\'t contains :Not-Emoji: and ::\nbut 💯'))
    })
}
