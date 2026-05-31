import type { APIRequestContext } from "@playwright/test";
import { requestPasswordReset, signUpEmail } from "better-auth/api";
import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

const signUpEmailPath = signUpEmail().path;
const requestPasswordResetPath = requestPasswordReset.path;

async function postAuth(
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

test("auth sign up rate limit", async ({ database, withRequest }) => {
	await database.kysely
		.updateTable("rate_limit_rule")
		.set({
			limit: 2,
		})
		.where("name", "=", "sign-up:request")
		.executeTakeFirstOrThrow();

	for (let index = 0; index < 2; index++) {
		const user = createUser();
		const response = await withRequest(async (request) => {
			return postAuth(request, `/api/auth${signUpEmailPath}`, {
				email: user.email,
				name: user.email,
				password: user.password,
			});
		});

		expect(response.status).not.toBe(429);
	}

	const blockedUser = createUser();
	const blockedResponse = await withRequest(async (request) => {
		return postAuth(request, `/api/auth${signUpEmailPath}`, {
			email: blockedUser.email,
			name: blockedUser.email,
			password: blockedUser.password,
		});
	});

	expect(blockedResponse.status).toBe(429);
});

test("auth password reset request rate limit", async ({ appOrigin, database, withRequest }) => {
	void database;
	await withRequest(async (request) => {
		const user = createUser();
		const redirectTo = new URL("/cs/reset-password/-placeholder-", appOrigin).toString();

		for (let index = 0; index < 3; index++) {
			const response = await postAuth(request, `/api/auth${requestPasswordResetPath}`, {
				email: user.email,
				redirectTo,
			});

			expect(response.status).not.toBe(429);
		}

		const blockedResponse = await postAuth(request, `/api/auth${requestPasswordResetPath}`, {
			email: user.email,
			redirectTo,
		});

		expect(blockedResponse.status).toBe(429);
	});
});
