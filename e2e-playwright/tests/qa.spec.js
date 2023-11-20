const { test, expect } = require("@playwright/test");

test("User can click on course to open course page", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1000);
  const courseName = 'Designing and Developing Scalable Web Applications'
  await page.locator(`a >> text='${courseName}'`).click();

  await expect(page.locator("h2")).toHaveText(courseName);
});

test("User can create question and open question page", async ({ page }) => {
  await page.goto("/courses/1");
  await page.waitForTimeout(1000);

  const question = randomString(30);
  await page.locator("#questionText").fill(question);
  await page.locator("#submitBtn").click();
  await page.locator(`p:has-text("${question}") ~ a`).click();

  await expect(page.locator("#questionText")).toHaveText(question);
});

test("User can create answer to question", async ({ page }) => {
  await page.goto("/courses/1");
  await page.waitForTimeout(1000);

  const question = randomString(30);
  await page.locator("#questionText").fill(question);
  await page.locator("#submitBtn").click();
  await page.locator(`p:has-text("${question}") ~ a`).click();
  await page.waitForTimeout(1000);

  const answer = randomString(30);
  await page.locator("#answerText").fill(answer);
  await page.locator("#submitBtn").click();

  await expect(page.locator(`p >> text='${answer}'`)).toHaveText(answer);
});

test("User can upvote question, which increases upvotes by 1", async ({ page }) => {
  await page.goto("/courses/1");
  await page.waitForTimeout(1000);

  const question = randomString(30);
  await page.locator("#questionText").fill(question);
  await page.locator("#submitBtn").click();

  const upvotes = await page.locator(`p:has-text("${question}") ~ button`).textContent();
  await page.locator(`p:has-text("${question}") ~ button`).click();

  await expect(page.locator(`p:has-text("${question}") ~ button`)).toHaveText(`${parseInt(upvotes) + 1}`);
});

test("User can upvote answer, which increases upvotes by 1", async ({ page }) => {
  await page.goto("/courses/1");
  await page.waitForTimeout(1000);

  const question = randomString(30);
  await page.locator("#questionText").fill(question);
  await page.locator("#submitBtn").click();
  await page.locator(`p:has-text("${question}") ~ a`).click();
  await page.waitForTimeout(1000);

  const answer = randomString(30);
  await page.locator("#answerText").fill(answer);
  await page.locator("#submitBtn").click();

  const upvotes = await page.locator(`p:has-text("${answer}") ~ button`).textContent();
  await page.locator(`p:has-text("${answer}") ~ button`).click();

  await expect(page.locator(`p:has-text("${answer}") ~ button`)).toHaveText(`${parseInt(upvotes) + 1}`);
});

const randomString = (length) => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
};