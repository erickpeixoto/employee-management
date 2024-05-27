import { test, expect } from '@playwright/test';

test.describe('Employee List Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
  });

  test('should have the correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Employee Management/);
  });

  test('should have a heading lable', async ({ page }) => {
    const heading = page.locator('h1');
    await expect(heading).toHaveText('All People');
  });


  test('should have a list of employees', async ({ page }) => {
    const employeeList = page.locator('ul');
    await expect(employeeList).toBeVisible();
  });

  test('should display the list of employees', async ({ page }) => {
    const employeeList = page.locator('ul');
    await expect(employeeList).toBeVisible();
    const employees = page.locator('li');
    await expect(employees).toBeVisible();
  });

  test.describe('New Employee Modal', () => {
    test.skip('should open the modal when the button is clicked', async ({ page }) => {
      const button = page.locator('button');
      await button.click();
      const modal = page.locator('div.modal');
      await expect(modal).toBeVisible();
    });

    test.skip('should close the modal when the close button is clicked', async ({ page }) => {
      const button = page.locator('button');
      await button.click();
      const modal = page.locator('div.modal');
      await expect(modal).toBeVisible();
      const closeButton = page.locator('button.close');
      await closeButton.click();
      await expect(modal).not.toBeVisible();
    });

    test.skip('should close the modal when the save button is clicked', async ({ page }) => {
      const button = page.locator('button');
      await button.click();
      const modal = page.locator('div.modal');
      await expect(modal).toBeVisible();
      const saveButton = page.locator('button.save');
      await saveButton.click();
      await expect(modal).not.toBeVisible();
    });
  });
}); 
    
