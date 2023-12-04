const { test, expect } = require("@playwright/test");

test("User can click on course to open course page", async ({ page }) => {
  await page.goto("/");
  await page.waitForTimeout(1000);
  const courseName = 'Designing and Building Scalable Web Applications'
  await page.locator(`a >> text='${courseName}'`).click();

  await expect(page.locator("h2")).toHaveText(courseName);
});

test("User can create question and open question page", async ({ page }) => {
  await page.goto("/courses/1");
  await page.waitForTimeout(1000);
  await setRandomUserUuid(page); // use random user uuid to avoid rate limiting

  const questionTitle = randomString(10);
  await page.locator("#questionTitle").fill(questionTitle);
  const questionText = randomString(30);
  await page.locator("#questionText").fill(questionText);

  await page.locator("#submitBtn").click();
  await page.locator(`a:has-text("${questionTitle}")`).click();

  await expect(page.locator("#questionText")).toHaveText(questionText);
});

test("User can create answer to question", async ({ page }) => {
  await page.goto("/courses/1");
  await page.waitForTimeout(1000);
  await setRandomUserUuid(page); // use random user uuid to avoid rate limiting

  const questionTitle = randomString(10);
  await page.locator("#questionTitle").fill(questionTitle);
  const questionText = randomString(30);
  await page.locator("#questionText").fill(questionText);
  await page.locator("#submitBtn").click();
  await page.locator(`a:has-text("${questionTitle}")`).click();
  await page.waitForTimeout(1000);

  await setRandomUserUuid(page); // use random user uuid to avoid rate limiting
  const answerText = randomString(30);
  await page.locator("#answerText").fill(answerText);
  await page.locator("#submitBtn").click();

  await expect(page.locator(`p >> text='${answerText}'`)).toHaveText(answerText);
});

test("User can upvote question, which increases upvotes by 1", async ({ page }) => {
  await page.goto("/courses/1");
  await page.waitForTimeout(1000);
  await setRandomUserUuid(page); // use random user uuid to avoid rate limiting

  const questionTitle = randomString(10);
  await page.locator("#questionTitle").fill(questionTitle);
  const questionText = randomString(30);
  await page.locator("#questionText").fill(questionText);
  await page.locator("#submitBtn").click();

  const upvotes = await page.locator(`a:has-text("${questionTitle}") ~ button`).textContent();
  await page.locator(`a:has-text("${questionTitle}") ~ button`).click();

  await expect(page.locator(`a:has-text("${questionTitle}") ~ button`)).toHaveText(`${parseInt(upvotes) + 1}`);
});

test("Creating two questions in succession triggers rate limiting", async ({ page }) => {
  await page.goto("/courses/1");
  await page.waitForTimeout(1000);
  await setRandomUserUuid(page); // use random user uuid to avoid rate limiting

  const question1Title = randomString(10);
  await page.locator("#questionTitle").fill(question1Title);
  const question1Text = randomString(30);
  await page.locator("#questionText").fill(question1Text);
  await page.locator("#submitBtn").click();

  const question2Title = randomString(10);
  await page.locator("#questionTitle").fill(question2Title);
  const question2Text = randomString(30);
  await page.locator("#questionText").fill(question2Text);
  await page.locator("#submitBtn").click();

  const errorMessage = "You can only create one question/answer per minute."
  await expect(page.locator("#errorMessage")).toHaveText(errorMessage);
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

const setRandomUserUuid = async (page) => {
  const userUuid = randomString(36);
  await page.evaluate(() => localStorage.setItem("userUuid", userUuid));
}