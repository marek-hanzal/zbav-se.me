import { Effect } from "effect";
import { sql } from "kysely";
import { parse } from "yaml";
import { z } from "zod";
import { TranslationSchema } from "@/lib/common/schema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";

const TranslationSourceSchema = z.record(
	z.string(),
	TranslationSchema.omit({
		key: true,
	}),
);

function* chunks<T>(items: readonly T[], size: number): Generator<readonly T[]> {
	if (size <= 0) {
		throw new Error("Chunk size must be greater than 0");
	}

	for (let index = 0; index < items.length; index += size) {
		yield items.slice(index, index + size);
	}
}

export namespace translationSyncWithFilesFx {
	export interface File {
		content: string;
		locale: string;
	}
}

export const translationSyncWithFilesFx = Effect.fn("translationSyncWithFilesFx")(function* (
	files: readonly translationSyncWithFilesFx.File[],
) {
	if (files.length === 0) {
		throw new Error("No translation files found.");
	}

	yield* withTransactionFx(
		Effect.gen(function* () {
			const { kysely } = yield* KyselyContextFx;

			yield* Effect.promise(async () => {
				await sql`truncate table translation`.execute(kysely);

				for (const file of files) {
					const content = Object.entries(
						TranslationSourceSchema.parse(parse(file.content)),
					);

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
