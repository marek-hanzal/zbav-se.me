import { withTestabaseFx } from "@use-pico/server/test";
import { database } from "@zbav-se.me/server/database";
import { Effect } from "effect";

export namespace waitForHttp {
	export interface Props {
		url: string;
		name: string;
		pattern?: RegExp;
	}
}

async function waitForHttp({ url, name, pattern }: waitForHttp.Props) {
	if (!url) {
		throw new Error(`Missing ${name} url.`);
	}

	const startedAt = Date.now();
	const timeoutMs = 60_000;
	const intervalMs = 500;

	while (Date.now() - startedAt < timeoutMs) {
		try {
			const response = await fetch(url, {
				redirect: "follow",
			});

			if (response.ok) {
				if (!pattern) {
					return;
				}

				const body = await response.text();

				if (pattern.test(body)) {
					return;
				}
			}
		} catch {
			//
		}

		await new Promise((resolve) => {
			setTimeout(resolve, intervalMs);
		});
	}

	throw new Error(`Timed out waiting for ${name} at ${url}.`);
}

export default async function globalSetup() {
	const cleanup = await withTestabaseFx({
		image: "nhost/postgres:17-20260320-1",
		name: "zbav-seme-e2e-postgres",
		port: 55432,
		template: "e2e",
		databaseFx: database,
	}).pipe(Effect.runPromise);

	await waitForHttp({
		url: `${process.env.VITE_SERVER_API}/api/public/health`,
		name: "server preview",
	});

	await waitForHttp({
		url: `${process.env.VITE_ORIGIN}`,
		name: "app preview",
		pattern: /<html/i,
	});

	return async () => {
		return cleanup();
	};
}
