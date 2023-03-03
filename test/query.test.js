#!/usr/bin/env node
/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var cjs = require('./../dist/client.cjs');
var clc = require("cli-color");

const serverUrl = process.env.npm_config_serverurl;
if (!serverUrl) {
  console.error( clc.red('Server url is not defined. Provide it with \'--serverUrl=\' arg.') );
  process.exit();
}

console.error( clc.green(`Starting test with url: ${ serverUrl }` ) );

const test = new cjs.Test( serverUrl );
test.testAll();

