"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pubsub_1 = require("@google-cloud/pubsub");
async function createtopic(projectId = 'class-material-reminder', // Your Google Cloud Platform project ID
topicName // Name for the new topic to create
) {
    // Instantiates a client
    const pubsub = new pubsub_1.PubSub({ projectId });
    // Creates the new topic
    const [topic] = await pubsub.createTopic(topicName);
    console.log(`Topic ${topic.name} created.`);
}
exports.createtopic = createtopic;
//# sourceMappingURL=pubsub.js.map