#!/bin/sh
cd $(dirname $(readlink -f "$0"))
npm install
node jesaja.js
