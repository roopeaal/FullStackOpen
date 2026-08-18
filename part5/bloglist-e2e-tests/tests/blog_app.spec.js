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
  })
})