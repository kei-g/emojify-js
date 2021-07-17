#!/bin/sh

[ -d dist/assets ] || mkdir -p dist/assets || exit 1
[ -d dist/bin ] || mkdir -p dist/bin || exit 1

cp node-emoji/lib/emoji.json dist/assets || exit 1

cd build && find . -type f | while read name; do
  dest=../dist/bin/$name
  echo '#!/usr/bin/env node' > $dest \
    && npx terser $name -c -m --toplevel >> $dest \
    && chmod +x $dest \
    && continue
  exit 1
done
