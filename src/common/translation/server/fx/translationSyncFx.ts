import { basename, extname } from "node:path";
import { Effect } from "effect";
import { sql } from "kysely";
import { parse } from "yaml";
import { z } from "zod";
import { TranslationSchema } from "@/lib/common/schema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

export const translationSyncFx = Effect.fn("translationSyncFx")(function* () {
	const files = yield* Effect.promise(async () => {
		const translationSourceMap = import.meta.glob(
			"/src/server/@migrations/translation/**/*.{yaml,yml}",
			{
				query: "?raw",
				import: "default",
			},
		) as Record<string, () => Promise<string>>;

		const keys = Object.keys(translationSourceMap).sort((left: string, right: string) => {
			return left.localeCompare(right);
		});

		return Promise.all(
			keys.map(async (key) => {
				const loader = translationSourceMap[key];

				if (!loader) {
					throw new Error(`Translation asset "${key}" is missing.`);
				}

				return {
					content: await loader(),
					locale: basename(key, extname(key)),
				};
			}),
		);
	});

	function* chunks<T>(items: readonly T[], size: number): Generator<readonly T[]> {
		if (size <= 0) {
			throw new Error("Chunk size must be greater than 0");
		}

		for (let index = 0; index < items.length; index += size) {
			yield items.slice(index, index + size);
		}
	}

	if (files.length === 0) {
		throw new Error("No translation files found.");
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

				for (const file of files) {
					const content = Object.entries(Schema.parse(parse(file.content)));

					for (const chunk of chunks(content, 250)) {
						await kysely
							.insertInto("translation")
							.values(
								chunk.map(([key, values]) => {
									return {
										key,
										locale: file.locale,
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
