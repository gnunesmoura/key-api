
const sqsHandlerMaker = (configFile) => {
  const AWS = require('aws-sdk');
  AWS.config.loadFromPath(configFile);
  const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

  const deleteMesssage = (queueAddress, message) => {
    const deleteParams = {
      QueueUrl: queueAddress,
      ReceiptHandle: message.ReceiptHandle,
    };
    sqs.deleteMessage(deleteParams, (err) => {
      if (err) throw err;
    });
  };

  const receive = (queueAddress, maxNumberOfMessages) => {
    const receiveParams = {
      QueueUrl: queueAddress,
      AttributeNames: ['All'],
      MaxNumberOfMessages: maxNumberOfMessages,
      MessageAttributeNames: ['All'],
    };

    return sqs.receiveMessage(receiveParams).promise()
      .then((response) => {
        if (!response.Messages) return undefined;
        return response.Messages;
      });
  };

  const receiveAndDelete = (queueAddress, maxNumberOfMessages) => receive(
    queueAddress,
    maxNumberOfMessages,
  )
    .then((messages) => {
      if (!messages) return undefined;
      messages.forEach(message => deleteMesssage(queueAddress, message));
      return messages;
    });

  return { receiveAndDelete, receive };
};

module.exports = sqsHandlerMaker;
