import fs from 'fs'
import * as dotenv from 'dotenv'
import { Configuration, OpenAIApi } from 'openai'

dotenv.config()

const configuration = new Configuration({
  apiKey: process.env.OPENAI_KEY
})
const openai = new OpenAIApi(configuration)

let userQuestion = 'What am i trying to do?'

console.log('Reading embeddings file...')
let embeddings = fs.readFileSync('./embeddings.json', 'utf8')
embeddings = JSON.parse(embeddings)

const compareEmbeddings = (embedding1, embedding2) => {
  let length = Math.min(embedding1.length, embedding2.length)
  let score = 0

  for (let i = 0; i < length; i++) {
    score += embedding1[i] * embedding2[i]
  }

  return score
}

const findClosestResults = (questionEmbedding, count) => {
  console.log('Finding closest results...')
  let items = []

  embeddings.forEach((item, index) => {
    items.push({
      text: item.text,
      index: index,
      score: compareEmbeddings(questionEmbedding, item.embedding)
    })
  })

  items.sort(function (a, b) {
    return b.score - a.score
  })

  let highScoreItems = items.slice(0, count)

  highScoreItems = highScoreItems.sort(function (a, b) {
    return a.index - b.index
  })

  highScoreItems = highScoreItems.map((item) => item.text)

  return highScoreItems
}

console.log('Creating user question embedding...')
let userEmbedding = await openai.createEmbedding({
  input: userQuestion,
  model: 'text-embedding-ada-002'
})

if (userEmbedding.status !== 200) {
  console.log('Error creating user embedding')
  console.log(userEmbedding)
  process.exit(1)
}

let userEmbeddingVector = userEmbedding.data.data[0].embedding

let closestResults = findClosestResults(userEmbeddingVector, 5)

console.log('results:', closestResults.join('\n\n'))
