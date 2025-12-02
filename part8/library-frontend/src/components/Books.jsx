import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

export const ALL_BOOKS = gql`
  query(
    $genreFilter: String
  ) {
    allBooks(genre: $genreFilter) {
      title
      author {
        name
      }
      published
      genres
    }
  }
`

export const FAVORITE_GENRE = gql`
  query {
    me {
      favoriteGenre
    }
  }
`

const Books = ({ show }) => {
  const [genreFilter, setGenreFilter] = useState(null)
  const [seenGenres, setSeenGenres] = useState([])
  const favoriteGenreResult = useQuery(FAVORITE_GENRE)
  const booksResult = useQuery(ALL_BOOKS, {
    variables: { genreFilter }
  })
  if (!show) {
    return null
  }
  if (booksResult.loading) {
    return null
  }
  let favoriteGenre = null
  if (!favoriteGenreResult.loading && favoriteGenreResult.data.me !== null) {
    favoriteGenre = favoriteGenreResult.data.me.favoriteGenre
  }
  const books = booksResult.data.allBooks

  const nonGenreFilters = ['no filter']
  if (favoriteGenre) {
    nonGenreFilters.push('favorite')
  }

  // Add genres to the seen list as we see them.
  // This is stored as a state so that the select doesn't forget
  // about genres that we filter away.
  let newSeenGenres = seenGenres.slice()
  for (const book of books) {
    for (const genre of book.genres) {
      if (newSeenGenres.indexOf(genre) === -1) {
        newSeenGenres.push(genre)
      }
    }
  }
  if (seenGenres.length !== newSeenGenres.length) {
    setSeenGenres(newSeenGenres)
  }

  const handleGenreFilterChange = ({ target }) => {
    switch (target.value) {
      case 'no filter':
        setGenreFilter(null)
        break
      case 'favorite':
        setGenreFilter(favoriteGenre)
        break
      default:
        setGenreFilter(target.value)
        break
    }
  }

  return (
    <div>
      <h2>books</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>Filter by Genre</h3>
      <select value={genreFilter} onChange={handleGenreFilterChange}>
        {nonGenreFilters.map(filter => <option key={filter} value={filter}>{filter}</option>)}
        {seenGenres.map(genre => <option key={genre} value={genre}>{genre}</option>)}
      </select>
    </div>
  )
}

export default Books
