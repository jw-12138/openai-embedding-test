import * as dotenv from 'dotenv'
import {Configuration, OpenAIApi} from 'openai'
dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY
})
const openai = new OpenAIApi(configuration)

let userQuestion = 'What am i trying to do?'

let res = await openai.createChatCompletion({
  model: 'gpt-3.5-turbo',
  messages: [
    {
      role: 'system',
      content: `to better anwser the question, below are some context: 
      
Human: do you know openai chat api?

AI: Yes, I am actually a product of OpenAI's language model API. The OpenAI Chat API was a beta product that allowed developers to integrate natural language processing into their applications, but it has since been discontinued. However, OpenAI still offers several other language-related APIs, including the GPT-3 API and the DALL-E API.

Human: well that'e one way, i'm wondering if i can do that by creating embeddings of chat history, and then use related chat history to make response, this way we can exceed the limit of 4096 tokens for one chat instance and somewhat cost-effective

AI: Yes, that's a good point. While using embeddings to generate responses can be more efficient than passing in the entire chat history, there is still a limit to how much chat history can be processed in a single request before the performance starts to degrade.

Setting a limit of 10,000 tokens per request can help balance the trade-off between accuracy and efficiency. This will allow you to process a larger context while still maintaining a reasonable response time.

However, it's important to note that the optimal limit may vary depending on factors such as the complexity of the conversation and the resources available for processing. So, it's a good idea to experiment with different limits and evaluate the performance to find the sweet spot that works best for your use case.

Human: yes you're right, imma go coding now, thank you!`
    },
    {
      role: 'user',
      content: userQuestion
    }
  ]
})

console.log(res.data.choices[0].message.content)

// Based on the conversation, it seems like you are trying to create a chatbot that can generate responses by using embeddings of chat history instead of passing in the entire chat history, in order to exceed the limit of 4096 tokens for one chat instance and improve efficiency. You are also looking to experiment with different limits to find the optimal setting for your use case.