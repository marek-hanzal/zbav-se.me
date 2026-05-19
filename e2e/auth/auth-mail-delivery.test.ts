import { Effect } from "effect";
import { genId } from "@/lib/common/gen-id";
import { auth } from "~/server/auth/auth";
import { withRuntimeFx } from "~/test/common/fx/withRuntimeFx";
import { withTranslatorFx } from "~/translator/server/fx/withTranslatorFx";
import { test, expect } from "../test";

const mailpitBaseUrl = process.env.MAILPIT_BASE_URL;

type MessageMatch = {
	recipient: string;
	subject: string;
};

async function waitForMailpitMessage({ recipient, subject }: MessageMatch) {
	if (!mailpitBaseUrl) {
		throw new Error("MAILPIT_BASE_URL is required for the auth mail delivery e2e test");
	}

	const deadline = Date.now() + 20_000;
	const query = `to:"${recipient}" subject:"${subject}"`;

	while (Date.now() < deadline) {
		const url = new URL("/view/latest.txt", mailpitBaseUrl);
		url.searchParams.set("query", query);

		const response = await fetch(url);

		if (response.ok) {
			return response.text();
		}

		await new Promise((resolve) => {
			setTimeout(resolve, 500);
		});
	}

	throw new Error(`Mailpit did not capture email for ${recipient} with subject "${subject}"`);
}

test("auth sign up sends verification email", async ({ database }) => {
	const email = `${genId()}@x32.cz`;
	const password = `pw-${genId()}`;
	const translator = await withTranslatorFx({
		locale: "cs",
	}).pipe(withRuntimeFx(database), Effect.runPromise);

	const subject = translator.text("Email verification email subject");
	const ath = auth({
		dialect: () => database.dialect,
		translator,
	});

	await ath.api.signUpEmail({
		body: {
			name: email,
			email,
			password,
		},
	});

	const text = await waitForMailpitMessage({
		recipient: email,
		subject,
	});

	await expect(text).toContain("Kliknutím potvrď svůj email");
	await expect(text).toContain("/api/auth/verify-email?token=");
});
