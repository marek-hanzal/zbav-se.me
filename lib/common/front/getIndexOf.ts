import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { getLogger } from "@logtape/logtape";
import type { z } from "zod";
import { frontOf } from "./frontOf";

const logger = getLogger("getIndexOf");

export namespace getIndexOf {
	export interface Props<TSchema extends z.ZodType> {
		schema: TSchema;
		source: string;
	}
}

export const getIndexOf = <TSchema extends z.ZodType>({
	schema,
	source,
}: getIndexOf.Props<TSchema>) => {
	logger.trace("getIndexOf", {
		source,
	});

	return readdirSync(source)
		.filter((file) => file.endsWith(".md"))
		.map((file) => {
			return frontOf({
				schema,
				source: readFileSync(join(source, file), "utf8"),
			});
		})
		.sort();
};
