#!/bin/sh

rm -fr assets || exit 1

fail() {
  rm -fr assets
  ln -s node-emoji/lib/emoji.json assets/
  exit 1
}

mkdir assets && cp node-emoji/lib/emoji.json assets/ || fail

[ -d bin ] || { mkdir -p bin || fail; }

dest=bin/emojify.js \
  && npx terser build/emojify.js -c -m -o $dest --toplevel \
  && chmod +x $dest \
  || fail
