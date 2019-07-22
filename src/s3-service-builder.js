const s3HandlerBuilder = require('./s3-handler-builder');

const generateGetFiles = builder => () => builder
  .s3Handler.listFiles(builder.bucket).then(({ Contents }) => Contents);

const generateDeleteFiles = builder => files => builder
  .s3Handler.deleteFiles(builder.bucket, files);

const generateCleanBucket = builder => async () => {
  let retry = 2;
  do {
    const files = await builder.s3Handler.listFiles(builder.bucket)
      .then(({ Contents }) => Contents);

    // Exists at least one file
    if (files && files.length) {
      await builder.s3Handler.deleteFiles(builder.bucket, files);
    } else {
      retry--;
    }
  } while (retry);
};

const serviceBuilder = () => {
  const builder = {};
  builder.withConfigFile = (configFile) => {
    builder.configFile = configFile;
    return builder;
  };

  builder.withBucket = (bucket) => {
    builder.bucket = bucket;
    return builder;
  };

  builder.build = () => {
    if (!builder.bucket) throw new Error('No bucket found. Insert bucket with method withBucket.');
    if (!builder.configFile) throw new Error('No json config file found. Insert config file with method withConfigFile.');

    builder.s3Handler = s3HandlerBuilder(builder.configFile);
    return {
      getFiles: generateGetFiles(builder),
      deleteFiles: generateDeleteFiles(builder),
      cleanBucket: generateCleanBucket(builder),
    };
  };

  return builder;
};

module.exports = serviceBuilder;
