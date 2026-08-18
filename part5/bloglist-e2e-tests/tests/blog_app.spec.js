const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')

    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(
      page.getByText('Log in to application')
    ).toBeVisible()

    await expect(
      page.getByRole('button', { name: 'login' })
    ).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const inputs = page.locator('input')

      await inputs.nth(0).fill('mluukkai')
      await inputs.nth(1).fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('Matti Luukkainen logged in')
      ).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const inputs = page.locator('input')

      await inputs.nth(0).fill('mluukkai')
      await inputs.nth(1).fill('wrongpassword')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('wrong username or password')
      ).toBeVisible()

      await expect(
        page.getByText('Log in to application')
      ).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      const inputs = page.locator('input')

      await inputs.nth(0).fill('mluukkai')
      await inputs.nth(1).fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('Matti Luukkainen logged in')
      ).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await page
        .getByRole('button', { name: 'create new blog' })
        .click()

      const inputs = page.locator('input')

      await inputs.nth(0).fill('Playwright test blog')
      await inputs.nth(1).fill('Roope Aaltonen')
      await inputs.nth(2).fill('https://example.com/playwright')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('Playwright test blog Roope Aaltonen')
      ).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page
        .getByRole('button', { name: 'create new blog' })
        .click()

      const inputs = page.locator('input')

      await inputs.nth(0).fill('Blog to like')
      await inputs.nth(1).fill('Roope Aaltonen')
      await inputs.nth(2).fill('https://example.com/like')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(
        page.getByText('likes 0')
      ).toBeVisible()

      await page.getByRole('button', { name: 'like' }).click()

      await expect(
        page.getByText('likes 1')
      ).toBeVisible()
    })

    test('user who created a blog can delete it', async ({ page }) => {
      await page
        .getByRole('button', { name: 'create new blog' })
        .click()

      const inputs = page.locator('input')

      await inputs.nth(0).fill('Blog to remove')
      await inputs.nth(1).fill('Roope Aaltonen')
      await inputs.nth(2).fill('https://example.com/remove')

      await page.getByRole('button', { name: 'create' }).click()

      await expect(
        page.getByText('Blog to remove Roope Aaltonen')
      ).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()

      page.once('dialog', async dialog => {
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'remove' }).click()

      await expect(
        page.getByText('Blog to remove Roope Aaltonen')
      ).not.toBeVisible()
    })

    test('only creator sees the remove button', async ({ page, request }) => {
      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Pekka Virtanen',
          username: 'pekka',
          password: 'salainen',
        },
      })

      await page
        .getByRole('button', { name: 'create new blog' })
        .click()

      const inputs = page.locator('input')

      await inputs.nth(0).fill('Creator only blog')
      await inputs.nth(1).fill('Roope Aaltonen')
      await inputs.nth(2).fill('https://example.com/creator')

      await page.getByRole('button', { name: 'create' }).click()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(
        page.getByRole('button', { name: 'remove' })
      ).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      const loginInputs = page.locator('input')

      await loginInputs.nth(0).fill('pekka')
      await loginInputs.nth(1).fill('salainen')

      await page.getByRole('button', { name: 'login' }).click()

      await expect(
        page.getByText('Pekka Virtanen logged in')
      ).toBeVisible()

      await page.getByRole('button', { name: 'view' }).click()

      await expect(
        page.getByRole('button', { name: 'remove' })
      ).toHaveCount(0)
    })
    test('blogs are ordered by likes with most liked first', async ({ page }) => {
      const createBlog = async (title, author, url) => {
        await page
          .getByRole('button', { name: 'create new blog' })
          .click()

        const inputs = page.locator('input')

        await inputs.nth(0).fill(title)
        await inputs.nth(1).fill(author)
        await inputs.nth(2).fill(url)

        await page.getByRole('button', { name: 'create' }).click()

        await expect(
          page.getByText(`${title} ${author}`)
        ).toBeVisible()
      }

      await createBlog(
        'First blog',
        'Roope Aaltonen',
        'https://example.com/first'
      )

      await createBlog(
        'Second blog',
        'Roope Aaltonen',
        'https://example.com/second'
      )

      await createBlog(
        'Third blog',
        'Roope Aaltonen',
        'https://example.com/third'
      )

      const secondBlog = page
        .locator('.blog')
        .filter({ hasText: 'Second blog' })

      await secondBlog
        .getByRole('button', { name: 'view' })
        .click()

      await secondBlog
        .getByRole('button', { name: 'like' })
        .click()

      await expect(secondBlog).toContainText('likes 1')

      const thirdBlog = page
        .locator('.blog')
        .filter({ hasText: 'Third blog' })

      await thirdBlog
        .getByRole('button', { name: 'view' })
        .click()

      await thirdBlog
        .getByRole('button', { name: 'like' })
        .click()

      await expect(thirdBlog).toContainText('likes 1')

      await thirdBlog
        .getByRole('button', { name: 'like' })
        .click()

      await expect(thirdBlog).toContainText('likes 2')

      const blogs = page.locator('.blog')

      await expect(blogs.nth(0)).toContainText('Third blog')
      await expect(blogs.nth(1)).toContainText('Second blog')
      await expect(blogs.nth(2)).toContainText('First blog')
    })
  })
})