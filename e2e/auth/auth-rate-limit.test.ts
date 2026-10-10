import type { APIRequestContext } from "@playwright/test";
import { requestPasswordReset, signUpEmail } from "better-auth/api";
import { expect, testFn } from "../testFn";
import { createUserFn } from "../utils/createUserFn";

const signUpEmailPath = signUpEmail().path;
const requestPasswordResetPath = requestPasswordReset.path;

async function postAuthFn(
	request: {
		post: APIRequestContext["post"];
	},
	path: string,
	body: object,
) {
	const response = await request.post(path, {
		data: body,
	});

	const text = await response.text();
	let json: unknown = null;

	try {
		json = JSON.parse(text);
	} catch {
		json = text;
	}

	return {
		status: response.status(),
		json,
	};
}

testFn("auth sign up rate limit", async ({ database, withRequestFn }) => {
	await database.kysely
		.updateTable("rate_limit_rule")
		.set({
			limit: 2,
		})
		.where("name", "=", "sign-up:request")
		.executeTakeFirstOrThrow();

	for (let index = 0; index < 2; index++) {
		const user = createUserFn();
		const response = await withRequestFn(async (request) => {
			return postAuthFn(request, `/api/auth${signUpEmailPath}`, {
				email: user.email,
				name: user.email,
				password: user.password,
			});
		});

		expect(response.status).toBeGreaterThanOrEqual(200);
		expect(response.status).toBeLessThan(300);
	}

	const blockedUser = createUserFn();
	const blockedResponse = await withRequestFn(async (request) => {
		return postAuthFn(request, `/api/auth${signUpEmailPath}`, {
			email: blockedUser.email,
			name: blockedUser.email,
			password: blockedUser.password,
		});
	});

	expect(blockedResponse.status).toBe(429);
});

testFn("auth password reset request rate limit", async ({ appOrigin, database, withRequestFn }) => {
	void database;
	await withRequestFn(async (request) => {
		const user = createUserFn();
		const redirectTo = new URL("/cs/reset-password/-placeholder-", appOrigin).toString();

		for (let index = 0; index < 3; index++) {
			const response = await postAuthFn(request, `/api/auth${requestPasswordResetPath}`, {
				email: user.email,
				redirectTo,
			});

			expect(response.status).toBeGreaterThanOrEqual(200);
			expect(response.status).toBeLessThan(300);
		}

		const blockedResponse = await postAuthFn(request, `/api/auth${requestPasswordResetPath}`, {
			email: user.email,
			redirectTo,
		});

		expect(blockedResponse.status).toBe(429);
	});
});
