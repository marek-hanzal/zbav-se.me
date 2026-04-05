import { readdirSync } from "node:fs";
import type { z } from "zod";
import { frontOf } from "./frontOf";

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
	return readdirSync(source)
		.filter((file) => file.endsWith(".md"))
		.map((source) => {
			return frontOf({
				schema,
				source,
			});
		})
		.sort();
};
