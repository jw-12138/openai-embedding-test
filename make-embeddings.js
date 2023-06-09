import * as dotenv from 'dotenv'
import fs from 'fs'
import {Configuration, OpenAIApi} from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY
})

const openai = new OpenAIApi(configuration)

console.log('Reading source file...')
let history = fs.readFileSync('./source.json', 'utf8')
history = JSON.parse(history)

let embeddingsInput = []

history.forEach((item) => {
  embeddingsInput.push(item.text)
})

console.log('Creating embeddings...')
let start = Date.now()
let res = await openai.createEmbedding({
  input: embeddingsInput,
  model: 'text-embedding-ada-002'
})

let end = Date.now()
let latency = end - start

if (res.status !== 200) {
  console.log('Error creating embeddings')
  console.log(res)
  process.exit(1)
}

console.log(`Embeddings created in ${latency} ms.`);

let output = []
res.data.data.forEach((item, index) => {
  let temp = {
    text: `${history[index].sender}: ${history[index].text}`,
    index: index,
    embedding: item.embedding
  }

  output.push(temp)
})

console.log('Writing embeddings to file...')
fs.writeFileSync('./embeddings.json', JSON.stringify(output))

console.log('Done!')