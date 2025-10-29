const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const testHelper = require('../utils/test_helper')

const api = supertest(app)

describe('users', () => {
  beforeEach(async () => {
    await testHelper.setupStartingUserAndBlog()
  })

  test('are returned as json', async () => {
    await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('contains blog data', async () => {
    const user = (await api.get('/api/users')).body[0]
    assert.ok(user.blogs)
    assert.strictEqual(user.blogs.length, 1)
    assert.strictEqual(user.blogs[0].title, 'On Instinct')
  })

  describe('POSTing a user', () => {
    test('adds the user to the list', async () => {
      const oldUsers = (await api.get('/api/users')).body
      const newUser = {
        userName: 'jerDawg',
        name: 'jeremy',
        password: 'swordfish'
      }
      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
      const newUsers = (await api.get('/api/users')).body
      assert.strictEqual(newUsers.length, oldUsers.length + 1, 'user count did not increase correctly')
      assert.strictEqual(newUsers[newUsers.length - 1].name, newUser.name, 'new user was saved incorrectly')
    })

    test('errors if password is unset', async () => {
      const newBlog = {
        userName: 'jerDawg',
        name: 'jeremy'
      }
      await api.post('/api/users').send(newBlog).expect(400)
    })

    test('errors if password is too short', async () => {
      const newBlog = {
        userName: 'jerDawg',
        name: 'jeremy',
        password: 'sw'
      }
      await api.post('/api/users').send(newBlog).expect(400)
    })

    test('errors if password is unset', async () => {
      const newBlog = {
        name: 'jeremy',
        password: 'swordfish'
      }
      await api.post('/api/users').send(newBlog).expect(400)
    })

    test('errors if userName is too short', async () => {
      const newBlog = {
        userName: 'je',
        name: 'jeremy',
        password: 'swordfish'
      }
      await api.post('/api/users').send(newBlog).expect(400)
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})