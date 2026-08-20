import { useState } from 'react'
import {
  Button,
  Stack,
  TextField,
  Typography,
} from '@mui/material'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = event => {
    event.preventDefault()

    createBlog({
      title,
      author,
      url,
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <Typography variant="h5" sx={{ mb: 2 }}>
        create new
      </Typography>

      <form onSubmit={addBlog}>
        <Stack spacing={2} sx={{ maxWidth: 400 }}>
          <TextField
            label="title"
            value={title}
            onChange={({ target }) =>
              setTitle(target.value)
            }
          />

          <TextField
            label="author"
            value={author}
            onChange={({ target }) =>
              setAuthor(target.value)
            }
          />

          <TextField
            label="url"
            value={url}
            onChange={({ target }) =>
              setUrl(target.value)
            }
          />

          <Button
            variant="contained"
            type="submit"
          >
            create
          </Button>
        </Stack>
      </form>
    </div>
  )
}

export default BlogForm