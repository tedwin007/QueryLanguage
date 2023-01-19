#!/usr/bin/node
var shell = require('shelljs');
require('dotenv').config();
const {  HOST, DB_NAME, USER_NAME, PASSWORD, DB_TYPE, OUTPUT_PATH } = process.env;
const hasEnvVar =Boolean(HOST && DB_NAME && USER_NAME && PASSWORD && DB_TYPE&& OUTPUT_PATH);

const cmd = 'npx typeorm-model-generator';
const envCMD = `${cmd} -h ${HOST} -d ${DB_NAME} -u ${USER_NAME} -x ${PASSWORD} -e ${DB_TYPE} -o ${OUTPUT_PATH}`;

if(!hasEnvVar){
    shell.exec(cmd).code !== 0
}else if ( shell.exec(envCMD).code !== 0) {
    shell.echo('Error: typeorm model generator failed');
    shell.exit(1);
}