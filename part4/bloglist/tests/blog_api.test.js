const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')

const api = supertest(app)

describe('blogs', () => {
  test('are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('returns the expected blogs', async () => {
    const blogs = (await api.get('/api/blogs')).body
    assert.strictEqual(blogs.length, 1)
    assert.strictEqual(blogs[0].title, 'On Instinct')
  })
})

after(async () => {
  await mongoose.connection.close()
})