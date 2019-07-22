
const s3HandlerMaker = (configFile) => {
  const AWS = require('aws-sdk');
  AWS.config.loadFromPath(configFile);
  AWS.config.region = undefined;

  const s3 = new AWS.S3({ apiVersion: '2006-03-01' });

  const deleteFiles = (bucket, files) => {
    try {
      const deleteParams = {
        Bucket: bucket,
        Delete: {
          Objects: files.map(({ Key }) => ({ Key })),
          Quiet: false,
        },
      };
      return s3.deleteObjects(deleteParams).promise();
    } catch (e) {
      console.log(`Error while deleting list of files from bucket ${bucket}`, e.message);
      throw e;
    }
  };

  const listFiles = (bucket) => {
    const params = {
      Bucket: bucket,
    };
    try {
      return s3.listObjects(params).promise();
    } catch (e) {
      console.log(`Error while getting list of files from bucket ${bucket}`, e.message);
      throw e;
    }
  };

  return { deleteFiles, listFiles };
};

module.exports = s3HandlerMaker;
