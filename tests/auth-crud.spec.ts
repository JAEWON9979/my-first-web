import { expect, test } from '@playwright/test';

function getTestCredentials() {
  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error('TEST_EMAIL과 TEST_PASSWORD 환경변수를 설정해 주세요.');
  }

  return { email, password };
}

function createUniquePost() {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');

  return {
    title: `E2E 게시글 ${stamp}`,
    content: `E2E 본문 ${stamp}\n두 번째 줄입니다.`,
  };
}

test('행복 경로: 로그인 후 새 글을 작성하고 목록에서 확인한다', async ({ page }) => {
  const { email, password } = getTestCredentials();
  const post = createUniquePost();

  await page.goto('/login');

  await page.getByLabel('이메일').fill(email);
  await page.getByLabel('비밀번호').fill(password);
  await page.getByRole('button', { name: '로그인' }).click();

  await expect(page).toHaveURL(/\/posts(?:\?.*)?$/);

  await page.goto('/posts/new');
  await expect(page.getByRole('heading', { name: '마크다운 글쓰기' })).toBeVisible();

  await page.getByLabel('제목').fill(post.title);
  await page.getByLabel('본문').fill(post.content);
  await page.getByRole('button', { name: '저장' }).click();

  await expect(page).toHaveURL(/\/posts(?:\?.*)?$/);
  await expect(page.getByRole('heading', { name: post.title, level: 2 })).toBeVisible();
});

test('거절 경로: 비로그인 상태에서 /posts/new 접속 시 /login으로 이동한다', async ({ browser, baseURL }) => {
  const guestContext = await browser.newContext({ baseURL });
  const guestPage = await guestContext.newPage();

  await guestPage.goto('/posts/new');

  await expect(guestPage).toHaveURL(/\/login(?:\?.*)?$/);
  await expect(guestPage.getByRole('button', { name: '로그인' })).toBeVisible();

  await guestContext.close();
});