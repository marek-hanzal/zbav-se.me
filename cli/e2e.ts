import { type ChildProcess, spawn } from "node:child_process";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { setupDatabaseFn } from "../e2e/setupDatabaseFn";

// Playwright starts webServer before globalSetup. Prepare the database before
// spawning the runner so the app and every worker inherit the same run DSN.
const args = process.argv.slice(2);
const inspectOnly = args.some((arg) =>
	[
		"--list",
		"--help",
		"-h",
	].includes(arg),
);
let child: ChildProcess | undefined;
let requestedSignal: NodeJS.Signals | undefined;
const forwardSignalFn = (signal: NodeJS.Signals) => {
	requestedSignal = signal;
	child?.kill(signal);
};
const interruptFn = () => forwardSignalFn("SIGINT");
const terminateFn = () => forwardSignalFn("SIGTERM");
process.on("SIGINT", interruptFn);
process.on("SIGTERM", terminateFn);

let database: Awaited<ReturnType<typeof setupDatabaseFn>> | undefined;
try {
	if (!inspectOnly) database = await setupDatabaseFn();
	if (requestedSignal) {
		process.exitCode = requestedSignal === "SIGINT" ? 130 : 143;
	} else {
		const packagePath = createRequire(import.meta.url).resolve("playwright/package.json");
		const cli = join(dirname(packagePath), "cli.js");
		child = spawn(
			process.execPath,
			[
				cli,
				"test",
				...args,
			],
			{
				stdio: "inherit",
				env: {
					...process.env,
					ZBAV_E2E_RUN: "1",
					SERVER_E2E: "e2e",
					...(database
						? {
								SERVER_DATABASE_URL: database.dsn,
							}
						: {}),
				},
			},
		);
		process.exitCode = await new Promise<number>((resolveFn, rejectFn) => {
			child?.once("error", rejectFn);
			child?.once("exit", (code, signal) =>
				resolveFn(code ?? (signal === "SIGINT" ? 130 : 143)),
			);
		});
	}
} finally {
	try {
		await database?.cleanupFn();
	} finally {
		process.off("SIGINT", interruptFn);
		process.off("SIGTERM", terminateFn);
	}
}
