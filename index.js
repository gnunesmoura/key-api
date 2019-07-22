
const sqsServiceBuilder = require('./src/sqs-service-builder');
const s3ServiceBuilder = require('./src/s3-service-builder');
const oracleHandler = require('./src/oracle-handler');
const files = require('./src/files');

module.exports = {
  sqsServiceBuilder,
  filesUtil: files,
  s3ServiceBuilder,
  oracleHandler,
};
