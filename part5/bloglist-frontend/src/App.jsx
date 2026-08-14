import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)
  const [newBlogVisible, setNewBlogVisible] = useState(false)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)

      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = message => {
    setNotification(message)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const loggedInUser = await loginService.login({
        username,
        password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser',
        JSON.stringify(loggedInUser)
      )

      blogService.setToken(loggedInUser.token)

      setUser(loggedInUser)
      setUsername('')
      setPassword('')
    } catch (exception) {
      showNotification('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async blogObject => {
    try {
      const newBlog = await blogService.create(blogObject)

      setBlogs(blogs.concat(newBlog))

      showNotification(
        `a new blog ${blogObject.title} by ${blogObject.author} added`
      )

      setNewBlogVisible(false)
    } catch (exception) {
      showNotification('blog could not be added')
    }
  }

  const updateBlog = async blog => {
    const userId =
      blog.user?.id ||
      blog.user?._id ||
      blog.user

    const changedBlog = {
      user: userId,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    }

    try {
      const returnedBlog = await blogService.update(
        blog.id,
        changedBlog
      )

      setBlogs(
        blogs.map(currentBlog =>
          currentBlog.id === blog.id
            ? { ...returnedBlog, user: blog.user }
            : currentBlog
        )
      )
    } catch (exception) {
      showNotification('blog could not be liked')
    }
  }

  if (user === null) {
    return (
      <div>
        <Notification message={notification} />

        <h2>Log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              value={username}
              onChange={({ target }) =>
                setUsername(target.value)
              }
            />
          </div>

          <div>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) =>
                setPassword(target.value)
              }
            />
          </div>

          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification message={notification} />

      <h2>blogs</h2>

      <p>
        {user.name} logged in{' '}
        <button onClick={handleLogout}>
          logout
        </button>
      </p>

      {!newBlogVisible && (
        <button onClick={() => setNewBlogVisible(true)}>
          create new blog
        </button>
      )}

      {newBlogVisible && (
        <div>
          <BlogForm createBlog={addBlog} />

          <button onClick={() => setNewBlogVisible(false)}>
            cancel
          </button>
        </div>
      )}

      {blogs.map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
        />
      )}
    </div>
  )
}

export default App