import { useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

import { ALL_AUTHORS } from './Authors'

const UPDATE_AUTHOR = gql`
  mutation updateAuthor(
    $name: String!
    $born: Int!
  ) {
    editAuthor(name: $name, setBornTo: $born) {
      name
      born
    }
  }
`

const AuthorUpdate = () => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [
      { query: ALL_AUTHORS },
    ],
    onError: (error) => console.log(error),
  })

  const submit = async (event) => {
    event.preventDefault()

    updateAuthor({ variables: { name, born: Number(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <form onSubmit={submit}>
        <div>
          name
          <input
            value={name}
            onChange={({ target }) => setName(target.value)}
          />
        </div>
        <div>
          born
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(target.value)}
          />
        </div>
        <button type="submit">update author</button>
      </form>
    </div>
  )
}

export default AuthorUpdate
