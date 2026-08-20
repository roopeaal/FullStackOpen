import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Link,
  Stack,
  Typography,
} from '@mui/material'

const Blog = ({
  blog,
  updateBlog,
  removeBlog,
  user,
  detailed = false,
}) => {
  const [visible, setVisible] = useState(detailed)

  if (!blog) {
    return null
  }

  const canRemove =
    blog.user?.username === user?.username

  const blogUrl =
    blog.url.startsWith('http://') ||
    blog.url.startsWith('https://')
      ? blog.url
      : `https://${blog.url}`

  return (
    <Card
      className="blog"
      variant="outlined"
      sx={{
        maxWidth: 700,
        mt: 2,
      }}
    >
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Typography variant="h4">
              {blog.title} {blog.author}
            </Typography>

            {!detailed && (
              <Button
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                onClick={() => setVisible(!visible)}
              >
                {visible ? 'hide' : 'view'}
              </Button>
            )}
          </Box>

          {visible && (
            <>
              <Link
                href={blogUrl}
                target="_blank"
                rel="noreferrer"
              >
                {blog.url}
              </Link>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Typography>
                  likes {blog.likes}
                </Typography>

                {user && (
                  <Button
                    variant="contained"
                    size="small"
                    type="button"
                    onClick={() => updateBlog(blog)}
                  >
                    like
                  </Button>
                )}
              </Box>

              <Typography>
                {blog.user?.name || ''}
              </Typography>

              {canRemove && (
                <Box>
                  <Button
                    variant="outlined"
                    size="small"
                    type="button"
                    onClick={() => removeBlog(blog)}
                  >
                    remove
                  </Button>
                </Box>
              )}
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}

export default Blog