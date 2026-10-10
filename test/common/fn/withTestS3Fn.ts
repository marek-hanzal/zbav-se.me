import { randomUUID } from "node:crypto";
import { Client } from "minio";
import { ensureDockerFn } from "~/docker/fn/ensureDockerFn";
import { runImageFn } from "~/docker/fn/runImageFn";
import type { s3Config } from "~/s3/context/s3ConfigFx";
import { shFn } from "~/shell/fn/shFn";
import { sleepFn } from "~/timing/fn/sleepFn";

export const withTestS3Fn = async () => {
	ensureDockerFn();
	const name = `zbav-seme-test-s3-${randomUUID()}`;
	const bucket = "uploads";
	const key = "test-access";
	const secret = "test-secret";
	const cleanupFn = () => {
		const id = shFn(
			[
				"docker",
				"ps",
				"--all",
				"--filter",
				`name=^/${name}$`,
				"--format",
				"{{.ID}}",
			],
			"Cannot inspect test S3 container",
		).stdout;
		if (id)
			shFn(
				[
					"docker",
					"rm",
					"-f",
					"-v",
					id,
				],
				"Cannot remove test S3 container",
			);
	};

	try {
		runImageFn({
			image: "chrislusf/seaweedfs:4.48",
			name,
			flags: [
				"--tmpfs",
				"/data:rw",
			],
			env: {
				AWS_ACCESS_KEY_ID: key,
				AWS_SECRET_ACCESS_KEY: secret,
				S3_BUCKET: bucket,
			},
			port: [
				"127.0.0.1::8333",
			],
			message: "Cannot start test S3 container",
		});
		const binding = shFn(
			[
				"docker",
				"port",
				name,
				"8333/tcp",
			],
			"Cannot read test S3 port",
		).stdout;
		const port = Number(binding.split(":").at(-1));
		const config: s3Config = {
			api: `http://127.0.0.1:${port}`,
			bucket,
			key,
			secret,
		};
		const client = new Client({
			endPoint: "127.0.0.1",
			port,
			useSSL: false,
			accessKey: key,
			secretKey: secret,
		});
		const deadline = Date.now() + 15_000;
		let error: unknown;
		while (Date.now() < deadline) {
			try {
				if (await client.bucketExists(bucket))
					return {
						config,
						cleanupFn,
					};
			} catch (cause) {
				error = cause;
			}
			await sleepFn(100);
		}
		throw new Error("Test S3 bucket did not become ready", {
			cause: error,
		});
	} catch (error) {
		cleanupFn();
		throw error;
	}
};
