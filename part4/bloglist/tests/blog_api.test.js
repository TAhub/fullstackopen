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
    assert.strictEqual(blogs.length > 0, true, 'no blogs present')
    assert.strictEqual(blogs[0].title, 'On Instinct')
  })

  test('rename the default _id property to id', async () => {
    const blogs = (await api.get('/api/blogs')).body
    assert.ok(blogs[0].id, '"id" is not present')
    assert.strictEqual(!blogs[0]._id, true, '"_id" is still present')
  })

  test('can post new blogs', async () => {
    const oldBlogs = (await api.get('/api/blogs')).body
    const newBlog = {
      title: "Fake Blog",
      author: "Author",
      url: "https://fullstackopen.com/",
      likes: Math.floor(Math.random(1000))
    }
    const result = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const newBlogs = (await api.get('/api/blogs')).body
    assert.strictEqual(newBlogs.length, oldBlogs.length + 1, 'blog count did not increase correctly')
    assert.strictEqual(newBlogs[newBlogs.length - 1].likes, newBlog.likes, 'new blog was saved incorrectly')
  })
})

after(async () => {
  await mongoose.connection.close()
})