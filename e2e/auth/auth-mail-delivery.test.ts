import { Effect } from "effect";
import { genIdFn } from "~/identity/fn/genIdFn";
import { withRuntimeFn } from "~/test/common/fx/withRuntimeFn";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";
import { withTranslatorFx } from "~/translator/fx/withTranslatorFx";
import { expect, testFn } from "../testFn";

const mailpitBaseUrl = process.env.MAILPIT_BASE_URL;

type MessageMatch = {
	recipient: string;
	subject?: string;
};

type MailpitMessageListItem = {
	ID: string;
	Subject: string;
	To: Array<{
		Address: string;
	}>;
};

type MailpitMessageList = {
	messages: MailpitMessageListItem[];
};

type MailpitMessage = {
	Subject: string;
	Text: string;
};

function parseMagicLinkFn(text: string) {
	const match = text.match(/https?:\/\/\S+\/api\/auth\/magic-link\/verify\?\S+/);

	if (!match) {
		throw new Error("Magic link email does not contain a verification URL");
	}

	return match[0].replace(/[.)\]]+$/, "");
}

async function waitForMailpitMessageFn({ recipient, subject }: MessageMatch) {
	if (!mailpitBaseUrl) {
		throw new Error("MAILPIT_BASE_URL is required for the auth mail delivery e2e test");
	}

	const deadline = Date.now() + 20_000;

	while (Date.now() < deadline) {
		const listResponse = await fetch(new URL("/api/v1/messages", mailpitBaseUrl), {
			signal: AbortSignal.timeout(2_000),
		});

		if (!listResponse.ok) {
			throw new Error(`Mailpit message listing failed (${listResponse.status})`);
		}

		const list = (await listResponse.json()) as MailpitMessageList;
		const message = list.messages.find((item) => {
			if (subject && item.Subject !== subject) {
				return false;
			}

			return item.To.some((target) => {
				return target.Address === recipient;
			});
		});

		if (message) {
			const messageResponse = await fetch(
				new URL(`/api/v1/message/${message.ID}`, mailpitBaseUrl),
				{
					signal: AbortSignal.timeout(2_000),
				},
			);

			if (messageResponse.ok) {
				const detail = (await messageResponse.json()) as MailpitMessage;

				return detail;
			}
		}

		await new Promise((resolveFn) => {
			setTimeout(resolveFn, 500);
		});
	}

	throw new Error(`Mailpit did not capture email for recipient "${recipient}"`);
}

testFn("auth sign up sends verification email", async ({ page, database }) => {
	const email = `${genIdFn()}@x32.cz`;
	const password = `pw-${genIdFn()}`;
	const translator = await withTranslatorFx({
		locale: "cs",
	}).pipe(withRuntimeFn(database), Effect.runPromise);

	const subject = translator.textFn("Email verification email subject");

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-up"]');
	await page.waitForURL("/cs/sign-up");
	await page.locator('[data-ui="SignUp-[EmailInput]"]').fill(email);
	await page.locator('[data-ui="SignUp-[PasswordInput]"]').fill(password);
	await page.locator('[data-ui="SignUp-[ConfirmPasswordInput]"]').fill(password);
	await page.locator('[data-action="sign up"]').click();
	await page.waitForURL("/cs/app/welcome");

	const mail = await waitForMailpitMessageFn({
		recipient: email,
	});

	expect(mail.Subject).toBe(subject);
	expect(mail.Text).toContain("Kliknutím potvrď svůj email");
	expect(mail.Text).toContain("/api/auth/verify-email?token=");
});

testFn("auth magic link sends email and signs in", async ({ page, database }) => {
	const user = await leaseTestUserFx({
		key: "a",
	}).pipe(withRuntimeFn(database), Effect.runPromise);
	const email = `${genIdFn()}@x32.cz`;

	await database.kysely
		.updateTable("user")
		.set({
			email,
		})
		.where("id", "=", user.id)
		.executeTakeFirstOrThrow();

	const translator = await withTranslatorFx({
		locale: "cs",
	}).pipe(withRuntimeFn(database), Effect.runPromise);
	const subject = translator.textFn("Magic link email subject");

	await page.goto("/cs/app/home");
	await page.waitForURL(/\/cs\/sign-in(?:\?.*)?$/);
	const magicEmailInput = page.locator('[data-ui="SignIn-[MagicEmailInput]"]');

	await magicEmailInput.scrollIntoViewIfNeeded();
	await magicEmailInput.fill(email);
	await page.locator('[data-action="sign in with magic link"]').click();
	await page.waitForURL("/cs/status/magic-link");

	const mail = await waitForMailpitMessageFn({
		recipient: email,
		subject,
	});

	expect(mail.Subject).toBe(subject);
	expect(mail.Text).toContain("/api/auth/magic-link/verify?token=");

	await page.goto(parseMagicLinkFn(mail.Text));
	await page.waitForURL("/cs/app/home");

	await expect(page.locator('[data-ui="HomeMenu[Container]"]')).toBeVisible();
});

testFn(
	"auth magic link rate limit returns a client-safe error",
	async ({ appOrigin, withRequestFn }) => {
		const email = `${genIdFn()}@x32.cz`;
		const body = {
			email,
			callbackURL: new URL("/cs/app/home", appOrigin).toString(),
		};
		const expectedMessage = "Too many magic link requests. Please try again later.";

		await withRequestFn(async (request) => {
			for (let attempt = 0; attempt < 3; attempt++) {
				const response = await request.post("/api/auth/sign-in/magic-link", {
					data: body,
				});

				expect(response.ok()).toBe(true);
			}

			const response = await request.post("/api/auth/sign-in/magic-link", {
				data: body,
			});
			const text = await response.text();

			expect(response.status()).toBe(429);
			expect(text).toContain(expectedMessage);
			expect(text).not.toContain("SERVER_ERROR");
			expect(text).not.toContain("FiberFailure");
		});
	},
);
