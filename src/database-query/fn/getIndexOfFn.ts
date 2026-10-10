import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getLogger } from "@logtape/logtape";
import type { z } from "zod";
import { frontOfFn } from "~/database-query/fn/frontOfFn";

const logger = getLogger([
	"lib",
	"common",
	"getIndexOf",
]);

export namespace getIndexOfFn {
	export type Type<TSchema extends z.ZodType> = frontOfFn.Type<TSchema>[];

	export interface Props<TSchema extends z.ZodType> {
		schema: TSchema;
		source: string;
	}
}

export const getIndexOfFn = <TSchema extends z.ZodType>({
	schema,
	source,
}: getIndexOfFn.Props<TSchema>): getIndexOfFn.Type<TSchema> => {
	logger.trace("getIndexOf", {
		source,
	});

	return readdirSync(source)
		.filter((file) => file.endsWith(".md"))
		.map((file) => {
			logger.trace("file", {
				file,
			});

			return frontOfFn({
				schema,
				source: readFileSync(join(source, file), "utf8"),
			});
		})
		.sort();
};
