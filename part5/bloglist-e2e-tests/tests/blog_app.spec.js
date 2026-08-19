const { test, expect, beforeEach, describe } = require('@playwright/test')

const login = async page => {
  await page.getByRole('link', { name: 'login' }).click()

  const inputs = page.locator('input')

  await inputs.nth(0).fill('mluukkai')
  await inputs.nth(1).fill('salainen')

  await page.getByRole('button', { name: 'login' }).click()

  await expect(
    page.getByText('Matti Luukkainen logged in')
  ).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post(
      'http://localhost:3003/api/testing/reset'
    )

    await request.post(
      'http://localhost:3003/api/users',
      {
        data: {
          name: 'Matti Luukkainen',
          username: 'mluukkai',
          password: 'salainen',
        },
      }
    )

    await page.goto('http://localhost:5173')
  })

  test('login succeeds with correct credentials', async ({ page }) => {
    await login(page)

    await expect(page).toHaveURL('http://localhost:5173/')
  })

  test('login fails with wrong credentials', async ({ page }) => {
    await page.getByRole('link', { name: 'login' }).click()

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

  test('logged in user can create a blog', async ({ page }) => {
    await login(page)

    await page.getByRole('link', { name: 'create' }).click()

    const inputs = page.locator('input')

    await inputs.nth(0).fill('Playwright test blog')
    await inputs.nth(1).fill('Roope Aaltonen')
    await inputs.nth(2).fill('https://example.com/playwright')

    await page.getByRole('button', { name: 'create' }).click()

    await expect(page).toHaveURL('http://localhost:5173/')

    await expect(
      page.getByRole('link', {
        name: 'Playwright test blog Roope Aaltonen',
      })
    ).toBeVisible()
  })

  test('logged in user can like a blog', async ({ page }) => {
    await login(page)

    await page.getByRole('link', { name: 'create' }).click()

    const inputs = page.locator('input')

    await inputs.nth(0).fill('Blog to like')
    await inputs.nth(1).fill('Roope Aaltonen')
    await inputs.nth(2).fill('https://example.com/like')

    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('link', {
      name: 'Blog to like Roope Aaltonen',
    }).click()

    await expect(
      page.getByText('likes 0')
    ).toBeVisible()

    await page.getByRole('button', { name: 'like' }).click()

    await expect(
      page.getByText('likes 1')
    ).toBeVisible()
  })

  test('logged in user can delete a blog', async ({ page }) => {
    await login(page)

    await page.getByRole('link', { name: 'create' }).click()

    const inputs = page.locator('input')

    await inputs.nth(0).fill('Blog to remove')
    await inputs.nth(1).fill('Roope Aaltonen')
    await inputs.nth(2).fill('https://example.com/remove')

    await page.getByRole('button', { name: 'create' }).click()

    await page.getByRole('link', {
      name: 'Blog to remove Roope Aaltonen',
    }).click()

    page.once('dialog', async dialog => {
      await dialog.accept()
    })

    await page.getByRole('button', { name: 'remove' }).click()

    await expect(page).toHaveURL('http://localhost:5173/')

    await expect(
      page.getByRole('link', {
        name: 'Blog to remove Roope Aaltonen',
      })
    ).toHaveCount(0)
  })
})