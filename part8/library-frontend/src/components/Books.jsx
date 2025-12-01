import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      author {
        name
      }
      published
    }
  }
`

const Books = ({ show }) => {
  if (!show) {
    return null
  }
  const booksResult = useQuery(ALL_BOOKS)
  if (booksResult.loading) {
    return null
  }
  const books = booksResult.data.allBooks

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
    </div>
  )
}

export default Books
