import net from "node:net";
import { sleep } from "./sleep";

export const waitForTcp = async (
	host: string,
	port: number,
	timeoutMs = 20_000,
) => {
	const startedAt = Date.now();

	while (Date.now() - startedAt < timeoutMs) {
		const ok = await new Promise<boolean>((resolve) => {
			const socket = net.connect({
				host,
				port,
			});

			socket.once("connect", () => {
				socket.end();
				resolve(true);
			});
			socket.once("error", () => resolve(false));
		});

		if (ok) {
			return;
		}

		await sleep(150);
	}

	throw new Error(`Postgres TCP not reachable on ${host}:${port}`);
};
