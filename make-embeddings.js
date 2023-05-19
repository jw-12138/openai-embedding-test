import * as dotenv from 'dotenv'
import axios from 'axios'
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
let res = await openai.createEmbedding({
  input: embeddingsInput,
  model: 'text-embedding-ada-002'
})

let output = []
res.data.data.forEach((item, index) => {
  let temp = {
    text: `${history[index].sender}: ${history[index].text}`,
    embedding: item.embedding
  }

  output.push(temp)
})

if (res.status !== 200) {
  console.log('Error creating embeddings')
  console.log(res)
  process.exit(1)
}

console.log('Writing embeddings to file...')
fs.writeFileSync('./embeddings.json', JSON.stringify(output))

console.log('Done!')