const { test } = require('@playwright/test');
const fs = require('fs');

test('Capture Access Token', async ({ page }) => {

    // Wait for OAuth Token API
    const tokenPromise = page.waitForResponse(response =>
        response.url().includes('/oauth/token') &&
        response.request().method() === 'POST'
    );

    // Open Application
    await page.goto('https://datamanager.us.oat.brightmine.com');

    // Login
    await page.fill('#username', 'YOUR_USERNAME');
    await page.fill('#password', 'YOUR_PASSWORD');

    await page.click('button[type="submit"]');

    // Wait until token API returns
    const tokenResponse = await tokenPromise;

    // Convert response to JSON
    const tokenJson = await tokenResponse.json();

    console.log(tokenJson);

    // Save JSON
    fs.writeFileSync(
        './token.json',
        JSON.stringify(tokenJson, null, 2)
    );

    console.log("✅ Token Saved Successfully");
});