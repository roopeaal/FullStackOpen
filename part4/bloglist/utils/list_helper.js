const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => {
    return sum + blog.likes
  }, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  return blogs.reduce((favorite, blog) => {
    return blog.likes > favorite.likes
      ? blog
      : favorite
  })
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  const blogCounts = blogs.reduce((counts, blog) => {
    const currentCount = counts.get(blog.author) || 0

    counts.set(blog.author, currentCount + 1)

    return counts
  }, new Map())

  return [...blogCounts.entries()].reduce(
    (topAuthor, [author, blogCount]) => {
      return blogCount > topAuthor.blogs
        ? {
            author,
            blogs: blogCount,
          }
        : topAuthor
    },
    {
      author: null,
      blogs: 0,
    }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
}