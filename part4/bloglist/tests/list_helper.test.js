const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const testBlogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

describe('dummy', () => {
  test('returns one', () => {
    const result = listHelper.dummy([])
    assert.strictEqual(result, 1)
  })
})

describe('total likes', () => {
  test('returns zero for an empty array', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('returns the likes of the blog passed in, if only one is', () => {
    const result = listHelper.totalLikes([testBlogs[0]])
    assert.strictEqual(result, 7)
  })

  test('adds together likes of multiple blogs', () => {
    const result = listHelper.totalLikes(testBlogs)
    assert.strictEqual(result, 36)
  })
})

describe('favorite blog', () => {
  test('returns null for an empty array', () => {
    const result = listHelper.favoriteBlog([])
    assert.strictEqual(result, null)
  })

  test('returns the most popular blog', () => {
    const result = listHelper.favoriteBlog(testBlogs)
    assert.deepStrictEqual(result, testBlogs[2])
  })
})

describe('most blogs', () => {
  test('returns null for an empty array', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('returns the most prolific author', () => {
    const result = listHelper.mostBlogs(testBlogs)
    assert.deepStrictEqual(result, {author: 'Robert C. Martin', blogs: 3})
  })
})

describe('most likes', () => {
  test('returns null for an empty array', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('returns the most liked author', () => {
    const result = listHelper.mostLikes(testBlogs)
    assert.deepStrictEqual(result, {author: 'Edsger W. Dijkstra', likes: 17})
  })
})