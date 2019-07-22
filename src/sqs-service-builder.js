const sqsHandlerBuilder = require('./sqs-handler-builder');

const sqsServiceBuilder = () => {
  const builder = {};
  builder.withConfigFile = (configFile) => {
    builder.configFile = configFile;
    return builder;
  };

  builder.withInQueue = (inQueue) => {
    builder.inQueue = inQueue;
    return builder;
  };

  builder.build = () => {
    if (!builder.inQueue) throw new Error('No in queue found. Insert in queue with method withInQueue.');
    if (!builder.configFile) throw new Error('No json config file found. Insert config file with method withConfigFile.');

    builder.sqsHandler = sqsHandlerBuilder(builder.configFile);
    return {
      getMessage: () => builder.sqsHandler
        .receiveAndDelete(builder.inQueue, 1)
        .then(messages => (messages ? messages[0] : messages)),
      cleanInQueue: async () => {
        let retry = 2;
        do {
          const message = await builder.sqsHandler.receiveAndDelete(builder.inQueue, 1);
          if (typeof message === 'undefined') {
            retry--;
            await new Promise(resolve => setTimeout(resolve, 500));
          }
        } while (retry);
      },
      existMessages: async () => {
        let retry = 2;
        do {
          const message = await builder.sqsHandler.receive(builder.inQueue, 1);
          if (typeof message !== 'undefined') {
            return true;
          }
          retry--;
          await new Promise(resolve => setTimeout(resolve, 500));
        } while (retry);

        return false;
      },
    };
  };

  return builder;
};

module.exports = sqsServiceBuilder;
