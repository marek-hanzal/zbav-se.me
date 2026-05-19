import type { APIRequest, APIRequestContext } from "@playwright/test";
import { requestPasswordReset, signUpEmail } from "better-auth/api";
import { expect, test } from "../test";
import { createUser } from "../utils/createUser";

const signUpEmailPath = signUpEmail().path;
const requestPasswordResetPath = requestPasswordReset.path;

async function createAuthRequest(
	appOrigin: string,
	db: string,
	request: APIRequest,
) {
	return request.newContext({
		baseURL: appOrigin,
		extraHTTPHeaders: {
			origin: appOrigin,
			"x-e2e-db": db,
		},
		ignoreHTTPSErrors: true,
	});
}

async function postAuth(request: APIRequestContext, path: string, body: object) {
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

test("auth sign up rate limit", async ({ appOrigin, database, db, playwright }) => {
	void database;
	const request = await createAuthRequest(appOrigin, db, playwright.request);

	try {
		for (let index = 0; index < 3; index++) {
			const user = createUser();
			const response = await postAuth(request, `/api/auth${signUpEmailPath}`, {
				email: user.email,
				name: user.email,
				password: user.password,
			});

			expect(response.status).not.toBe(429);
		}

		const blockedUser = createUser();
		const blockedResponse = await postAuth(request, `/api/auth${signUpEmailPath}`, {
			email: blockedUser.email,
			name: blockedUser.email,
			password: blockedUser.password,
		});

		expect(blockedResponse.status).toBe(429);
	} finally {
		await request.dispose();
	}
});

test("auth password reset request rate limit", async ({ appOrigin, database, db, playwright }) => {
	void database;
	const request = await createAuthRequest(appOrigin, db, playwright.request);

	try {
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
	} finally {
		await request.dispose();
	}
});
