import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { Effect } from "effect";
import type { SeedListingPlan } from "./listingSeedPlanFx";

const toBatchFilePath = (directory: string, batchIndex: number) => {
	return path.join(directory, `listing-seed-batch-${String(batchIndex).padStart(6, "0")}.json`);
};

export namespace createListingSeedBatchStoreFx {
	export interface Result {
		directory: string;
	}
}

export const createListingSeedBatchStoreFx = Effect.fn("createListingSeedBatchStoreFx")(
	function* () {
		const directory = yield* Effect.tryPromise({
			try: async () => {
				return fs.mkdtemp(path.join(os.tmpdir(), "zbav-seme-listing-seed-"));
			},
			catch: (cause) => new Error(String(cause)),
		});

		return {
			directory,
		} satisfies createListingSeedBatchStoreFx.Result;
	},
);

export const removeListingSeedBatchStoreFx = Effect.fn("removeListingSeedBatchStoreFx")(function* ({
	directory,
}: createListingSeedBatchStoreFx.Result) {
	yield* Effect.tryPromise({
		try: async () => {
			await fs.rm(directory, {
				force: true,
				recursive: true,
			});
		},
		catch: (cause) => new Error(String(cause)),
	});
});

export const writeListingSeedBatchFx = Effect.fn("writeListingSeedBatchFx")(function* ({
	directory,
	batchIndex,
	plans,
}: createListingSeedBatchStoreFx.Result & {
	batchIndex: number;
	plans: SeedListingPlan[];
}) {
	const filePath = toBatchFilePath(directory, batchIndex);

	yield* Effect.tryPromise({
		try: async () => {
			await fs.writeFile(filePath, JSON.stringify(plans), "utf8");
		},
		catch: (cause) => new Error(String(cause)),
	});

	return {
		filePath,
	};
});

export const readListingSeedBatchFx = Effect.fn("readListingSeedBatchFx")(function* ({
	filePath,
}: {
	filePath: string;
}) {
	const content = yield* Effect.tryPromise({
		try: async () => {
			return fs.readFile(filePath, "utf8");
		},
		catch: (cause) => new Error(String(cause)),
	});

	return JSON.parse(content) as SeedListingPlan[];
});

export const removeListingSeedBatchFx = Effect.fn("removeListingSeedBatchFx")(function* ({
	filePath,
}: {
	filePath: string;
}) {
	yield* Effect.tryPromise({
		try: async () => {
			await fs.rm(filePath, {
				force: true,
			});
		},
		catch: (cause) => new Error(String(cause)),
	});
});
