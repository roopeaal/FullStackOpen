import { useState, useEffect } from 'react'
import {
  Routes,
  Route,
  Link,
  useNavigate,
} from 'react-router-dom'
import Blog from './components/Blog'
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

const LoginForm = ({
  username,
  password,
  handleUsernameChange,
  handlePasswordChange,
  handleSubmit,
}) => (
  <div>
    <h2>Log in to application</h2>

    <form onSubmit={handleSubmit}>
      <div>
        username
        <input
          value={username}
          onChange={handleUsernameChange}
        />
      </div>

      <div>
        password
        <input
          type="password"
          value={password}
          onChange={handlePasswordChange}
        />
      </div>

      <button type="submit">login</button>
    </form>
  </div>
)

const BlogList = ({
  blogs,
  updateBlog,
  removeBlog,
  user,
}) => (
  <div>
    <h2>blogs</h2>

    {[...blogs]
      .sort((a, b) => b.likes - a.likes)
      .map(blog =>
        <Blog
          key={blog.id}
          blog={blog}
          updateBlog={updateBlog}
          removeBlog={removeBlog}
          user={user}
        />
      )}
  </div>
)

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON =
      window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      const loggedUser = JSON.parse(loggedUserJSON)

      setUser(loggedUser)
      blogService.setToken(loggedUser.token)
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
      navigate('/')
    } catch {
      showNotification('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser')
    blogService.setToken(null)
    setUser(null)
    navigate('/')
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
    } catch {
      showNotification('blog could not be liked')
    }
  }

  const removeBlog = async blog => {
    const confirmed = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    )

    if (!confirmed) {
      return
    }

    try {
      await blogService.remove(blog.id)

      setBlogs(
        blogs.filter(currentBlog =>
          currentBlog.id !== blog.id
        )
      )
    } catch {
      showNotification('blog could not be removed')
    }
  }

  const padding = {
    paddingRight: 5,
  }

  return (
    <div>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>

        {!user && (
          <Link style={padding} to="/login">
            login
          </Link>
        )}

        {user && (
          <span>
            {user.name} logged in{' '}
            <button onClick={handleLogout}>
              logout
            </button>
          </span>
        )}
      </div>

      <Notification message={notification} />

      <Routes>
        <Route
          path="/login"
          element={
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) =>
                setUsername(target.value)
              }
              handlePasswordChange={({ target }) =>
                setPassword(target.value)
              }
              handleSubmit={handleLogin}
            />
          }
        />

        <Route
          path="/"
          element={
            <BlogList
              blogs={blogs}
              updateBlog={updateBlog}
              removeBlog={removeBlog}
              user={user}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App