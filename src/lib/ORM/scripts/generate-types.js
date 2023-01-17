#!/usr/bin/node
var shell = require('shelljs');
require('dotenv').config();
if (shell.exec('npx typeorm-model-generator -h '+process.env.HOST+' -d '+process.env.DB_NAME+' -u '+process.env.USER_NAME+' -x '+process.env.PASSWORD+' -e '+process.env.DB_TYPE+' -o '+process.env.OUTPUT_PATH+'').code !== 0) {
  shell.echo('Error: typeorm model generator failed');
  shell.exit(1);
}


