import matter from "gray-matter";
import type { z } from "zod";

export namespace frontOf {
	export interface Props<TSchema extends z.ZodType> {
		schema: TSchema;
		source: string;
	}
}

export const frontOf = <TSchema extends z.ZodType>({ schema, source }: frontOf.Props<TSchema>) => {
	const topic = matter(source);

	return {
		...topic,
		data: schema.parse(topic.data),
	} as const;
};
