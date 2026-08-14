import { useState } from 'react'

const Blog = ({
  blog,
  updateBlog,
  removeBlog,
  user,
}) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  const canRemove =
    blog.user?.username === user.username

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>

      {visible && (
        <div>
          <div>{blog.url}</div>

          <div>
            likes {blog.likes}{' '}
            <button
              type="button"
              onClick={() => updateBlog(blog)}
            >
              like
            </button>
          </div>

          <div>
            {blog.user?.name || ''}
          </div>

          {canRemove && (
            <button
              type="button"
              onClick={() => removeBlog(blog)}
            >
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog