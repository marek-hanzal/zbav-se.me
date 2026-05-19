import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { withTranslatorFx } from "~/translator/server/fx/withTranslatorFx";
import { test, expect } from "../test";

const mailpitBaseUrl = process.env.MAILPIT_BASE_URL;

type MessageMatch = {
	recipient: string;
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

async function waitForMailpitMessage({ recipient }: MessageMatch) {
	if (!mailpitBaseUrl) {
		throw new Error("MAILPIT_BASE_URL is required for the auth mail delivery e2e test");
	}

	const deadline = Date.now() + 20_000;

	while (Date.now() < deadline) {
		const listResponse = await fetch(new URL("/api/v1/messages", mailpitBaseUrl));

		if (!listResponse.ok) {
			await new Promise((resolve) => {
				setTimeout(resolve, 500);
			});
			continue;
		}

		const list = (await listResponse.json()) as MailpitMessageList;
		const message = list.messages.find((item) => {
			return item.To.some((target) => {
				return target.Address === recipient;
			});
		});

		if (message) {
			const messageResponse = await fetch(
				new URL(`/api/v1/message/${message.ID}`, mailpitBaseUrl),
			);

			if (messageResponse.ok) {
				const detail = (await messageResponse.json()) as MailpitMessage;

				return detail;
			}
		}

		await new Promise((resolve) => {
			setTimeout(resolve, 500);
		});
	}

	throw new Error(`Mailpit did not capture email for recipient "${recipient}"`);
}

test("auth sign up sends verification email", async ({ page, database }) => {
	const email = `${genId()}@x32.cz`;
	const password = `pw-${genId()}`;
	const translator = await withTranslatorFx({
		locale: "cs",
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	const subject = translator.text("Email verification email subject");

	await page.goto("/cs/landing");
	await page.click('[data-action="goto sign-up"]');
	await page.waitForURL("/cs/sign-up");
	await page.locator('[data-ui="SignUpPage[EmailInput]"]').fill(email);
	await page.locator('[data-ui="SignUpPage[PasswordInput]"]').fill(password);
	await page.locator('[data-ui="SignUpPage[ConfirmPasswordInput]"]').fill(password);
	await page.locator('[data-action="sign up"]').click();
	await page.waitForURL("/cs/app/welcome");

	const mail = await waitForMailpitMessage({
		recipient: email,
	});

	await expect(mail.Subject).toBe(subject);
	await expect(mail.Text).toContain("Kliknutím potvrď svůj email");
	await expect(mail.Text).toContain("/api/auth/verify-email?token=");
});
