import { test, expect } from '@playwright/test';

// Group all test cases together
test.describe('Asana Demo App Functional Verification', () => {
  // This hook runs before every single test case below
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the absolute URL
    await page.goto('https://animated-gingersnap-8cf7f2.netlify.app/');

    // 2. Perform Login Sequence
    await page.locator('input#username, input[type="text"]').fill('admin');
    await page
      .locator('input#password, input[type="password"]')
      .fill('password123');
    await page
      .locator('button[type="submit"], .context-button, button')
      .click();

    // 3. Confirm successful login before proceeding
    await expect(page).not.toHaveURL(/.*login.*/);
  });

  /**
   * Helper function to find a card in a specific column and verify its tags
   */
  async function verifyTaskInColumn(
    page,
    project,
    columnTitle,
    taskTitle,
    expectedTags,
  ) {
    // Navigate to the target application project (e.g., "Web Application" or "Mobile Application")
    // Using strict text matching to ensure accurate sidebar clicks
    await page
      .locator('button, h2, a', { hasText: new RegExp(`^${project}$`) })
      .click();

    // Locate the specific column container by its heading
    // This looks for an element containing the column header (like h2) and grabs its parent container block
    const column = page
      .locator('div', { has: page.locator('h2', { hasText: columnTitle }) })
      .filter({
        has: page.locator('h3', { hasText: taskTitle }),
      })
      .first();

    // Pin down the specific task card within that exact column block
    const taskCard = column
      .locator('div', { has: page.locator('h3', { hasText: taskTitle }) })
      .first();
    await expect(taskCard).toBeVisible();

    // Loop through and assert each expected tag is visible within that specific task card
    for (const tag of expectedTags) {
      const tagElement = taskCard.locator('span', { hasText: tag }).first();
      await expect(tagElement).toBeVisible();
    }
  }

  // --- TEST CASES ---

  test('Test Case 1: Web Application - Implement user authentication', async ({
    page,
  }) => {
    await verifyTaskInColumn(
      page,
      'Web Application',
      'To Do',
      'Implement user authentication',
      ['Feature', 'High Priority'],
    );
  });

  test('Test Case 2: Web Application - Fix navigation bug', async ({
    page,
  }) => {
    await verifyTaskInColumn(
      page,
      'Web Application',
      'To Do',
      'Fix navigation bug',
      ['Bug'],
    );
  });

  test('Test Case 3: Web Application - Design system updates', async ({
    page,
  }) => {
    await verifyTaskInColumn(
      page,
      'Web Application',
      'In Progress',
      'Design system updates',
      ['Design'],
    );
  });

  test('Test Case 4: Mobile Application - Push notification system', async ({
    page,
  }) => {
    await verifyTaskInColumn(
      page,
      'Mobile Application',
      'To Do',
      'Push notification system',
      ['Feature'],
    );
  });

  test('Test Case 5: Mobile Application - Offline mode', async ({ page }) => {
    await verifyTaskInColumn(
      page,
      'Mobile Application',
      'In Progress',
      'Offline mode',
      ['Feature', 'High Priority'],
    );
  });

  test('Test Case 6: Mobile Application - App icon design', async ({
    page,
  }) => {
    await verifyTaskInColumn(
      page,
      'Mobile Application',
      'Done',
      'App icon design',
      ['Design'],
    );
  });
});
