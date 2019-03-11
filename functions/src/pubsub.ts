import {PubSub} from '@google-cloud/pubsub';

export async function createtopic(
  projectId = 'class-material-reminder', // Your Google Cloud Platform project ID
  topicName // Name for the new topic to create
){
  // Instantiates a client
  const pubsub = new PubSub({projectId});

  // Creates the new topic
  const [topic] = await pubsub.createTopic(topicName);
  console.log(`Topic ${topic.name} created.`);

}

