export const config = {
	directories: {
		app: new URL("../../apps/app", import.meta.url).pathname,
		server: new URL("../../apps/server", import.meta.url).pathname,
		e2e: new URL("../../apps/e2e", import.meta.url).pathname,
	},
	postgres: {
		image: "nhost/postgres:17-20260320-1",
		container: "zbav-seme-e2e-postgres",
		host: "127.0.0.1",
		port: 56432,
		user: "postgres",
		password: "e2e",
	},
	urls: {
		app: "http://zbav-se.me.localhost:1355",
		api: "http://api.zbav-se.me.localhost:1355",
	},
	timeouts: {
		ready: 120_000,
		stop: 250,
		short: 15_000,
		migration: 30_000,
	},
	previews: [
		{
			name: "server",
			cmd: [
				"portless",
				"--force",
				"api.zbav-se.me",
				"node",
				".output/server/index.mjs",
			],
		},
		{
			name: "app",
			cmd: [
				"portless",
				"--force",
				"zbav-se.me",
				"node",
				".output/server/index.mjs",
			],
		},
	],
} as const;
