import { readFileSync } from "node:fs";
import { readdir } from "node:fs/promises";
import { basename, extname, join } from "node:path";
import { Effect } from "effect";
import { sql } from "kysely";
import { parse } from "yaml";
import { z } from "zod";
import { TranslationSchema } from "@/lib/common/schema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export namespace translationSyncFx {
	export interface Props {
		source: string;
	}
}

export const translationSyncFx = Effect.fn("translationSyncFx")(function* ({
	source,
}: translationSyncFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	const files = yield* Effect.promise(async () => {
		return withSources(source);
	});

	function* chunks<T>(items: readonly T[], size: number): Generator<readonly T[]> {
		if (size <= 0) {
			throw new Error("Chunk size must be greater than 0");
		}

		for (let index = 0; index < items.length; index += size) {
			yield items.slice(index, index + size);
		}
	}

	const Schema = z.record(
		z.string(),
		TranslationSchema.omit({
			key: true,
		}),
	);

	yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			yield* Effect.promise(async () => {
				await sql`truncate table translation`.execute(kysely);

				for await (const file of files) {
					const name = basename(file, extname(file));
					const content = Object.entries(
						Schema.parse(parse(readFileSync(file, "utf-8"))),
					);

					for (const chunk of chunks(content, 250)) {
						await kysely
							.insertInto("translation")
							.values(
								chunk.map(([key, values]) => {
									return {
										key,
										locale: name,
										dynamic: false,
										...values,
									};
								}),
							)
							.execute();
					}
				}
			});
		}),
	);
});

export async function withSources(dir: string): Promise<string[]> {
	const entries = await readdir(dir, {
		withFileTypes: true,
	});

	const files: string[] = [];

	for (const entry of entries) {
		const path = join(dir, entry.name);

		if (entry.isDirectory()) {
			files.push(...(await withSources(path)));
			continue;
		}

		if (entry.isFile() && /\.(ya?ml)$/i.test(entry.name)) {
			files.push(path);
		}
	}

	return files;
}
