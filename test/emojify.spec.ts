import { buildDictionaryFrom, createContext, emojify, loadAssets } from '../src'
import { Transform } from 'stream'
import { describe, it } from 'mocha'
import { expect } from 'chai'

const options = [
  // for Node.js v6.0.0 or later
  [],

  // for Node.js v4.5.0 or later v4.x, v5.10.0 or later
  ['--avoid-subarray'],

  // for Node.js v4.0.0 or later
  ['--avoid-buffer-alloc', '--avoid-subarray']
]

describe('Wrapper for', () =>
  it(
    'loadAssets',
    async () => {
      const data = await loadAssets()
      describe(
        'Can load assets',
        () => {
          it('Has no error?', () => expect(data).is.not.instanceOf(Error))
          it('Is data instance of Buffer?', () => expect(data).instanceOf(Buffer))
        }
      )
      for (const argv of options) {
        const title = 'Test with' + (argv.length
          ? ' options, ' + argv.join(', ')
          : 'out options')
        describe(
          title,
          () => {
            const context = createContext(argv)
            const dict = buildDictionaryFrom(context, data)
            it(
              'Is tada contained in dictionary?',
              () => expect(dict['tada']).instanceOf(Buffer)
            )
            it(
              'Is ":tada:" able to be emojified?',
              (done: () => void) => {
                emojify(
                  {
                    context,
                    data: Buffer.from(':tada:'),
                    destination: new Transform(
                      {
                        transform(chunk: unknown) {
                          expect(chunk).instanceOf(Buffer)
                          expect(chunk.toString()).equals('🎉')
                        }
                      }
                    ),
                    dictionary: dict,
                  }
                )
                done()
              })
            it(
              'Is "Not-Emoji" not contained in dictionary?',
              () => expect(dict['Not-Emoji']).is.undefined
            )
            it(
              'Is empty string not contained in dictionary?',
              () => expect(dict['']).is.undefined
            )
            it(
              'Are ":Not-Emoji:" and "::" omitted?',
              (done: () => void) => {
                const text = 'Dictionary doesn\'t contain :Not-Emoji: and ::'
                emojify(
                  {
                    context,
                    data: Buffer.from(text),
                    destination: new Transform({
                      transform(chunk: unknown) {
                        expect(chunk).instanceOf(Buffer)
                        expect(chunk.toString()).equals(text)
                      }
                    }
                    ),
                    dictionary: dict,
                  }
                )
                done()
              }
            )
            it(
              'Is "100" contained in dictionary?',
              () => expect(dict['100']).instanceOf(Buffer)
            )
            it(
              'Is ":100:" able to be emojified?',
              (done: () => void) => {
                emojify(
                  {
                    context,
                    data: Buffer.from(':100:'),
                    destination: new Transform({
                      transform(chunk: unknown) {
                        expect(chunk).instanceOf(Buffer)
                        expect(chunk.toString()).equals('💯')
                      }
                    }
                    ),
                    dictionary: dict,
                  }
                )
                done()
              }
            )
          }
        )
      }
    }
  )
)
