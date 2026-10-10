import { expect, testFn } from "../testFn";

const invalidAuthorization = "Bearer definitely-not-the-token";

testFn("cron endpoint rejects requests without a valid token", async ({ withRequestFn }) => {
	await withRequestFn(async (request) => {
		const missingTokenResponse = await request.post("/api/cron/hourly");
		const invalidTokenResponse = await request.post("/api/cron/hourly", {
			headers: {
				authorization: invalidAuthorization,
			},
		});

		expect(missingTokenResponse.status()).toBe(401);
		expect(invalidTokenResponse.status()).toBe(401);
		expect(missingTokenResponse.headers()["www-authenticate"]).toBe("Bearer");
		expect(invalidTokenResponse.headers()["www-authenticate"]).toBe("Bearer");
	});
});

testFn("migration endpoint rejects requests without a valid token", async ({ withRequestFn }) => {
	await withRequestFn(async (request) => {
		const missingTokenResponse = await request.post("/api/public/migration/run");
		const invalidTokenResponse = await request.post("/api/public/migration/run", {
			headers: {
				authorization: invalidAuthorization,
			},
		});

		expect(missingTokenResponse.status()).toBe(401);
		expect(invalidTokenResponse.status()).toBe(401);
		expect(missingTokenResponse.headers()["www-authenticate"]).toBe("Bearer");
		expect(invalidTokenResponse.headers()["www-authenticate"]).toBe("Bearer");
	});
});
