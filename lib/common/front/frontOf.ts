import { getLogger } from "@logtape/logtape";
import matter from "gray-matter";
import type { z } from "zod";

const logger = getLogger("frontOf");

export namespace frontOf {
	export interface Props<TSchema extends z.ZodType> {
		schema: TSchema;
		source: string;
	}
}

export const frontOf = <TSchema extends z.ZodType>({ schema, source }: frontOf.Props<TSchema>) => {
	const topic = matter(source);

	logger.trace("frontOf", {
		data: topic.data,
	});

	return {
		...topic,
		data: schema.parse(topic.data),
	} as const;
};
