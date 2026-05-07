import { getLogger } from "@logtape/logtape";
import matter from "gray-matter";
import type { z } from "zod";

const logger = getLogger([
	"lib",
	"common",
	"frontOf",
]);

export namespace frontOf {
	export interface Type<TSchema extends z.ZodType>
		extends Omit<matter.GrayMatterFile<string>, "data"> {
		data: z.infer<TSchema>;
	}

	export interface Props<TSchema extends z.ZodType> {
		schema: TSchema;
		source: string;
	}
}

export const frontOf = <TSchema extends z.ZodType>({
	schema,
	source,
}: frontOf.Props<TSchema>): frontOf.Type<TSchema> => {
	const topic = matter(source);

	logger.trace("frontOf", {
		data: topic.data,
	});

	return {
		...topic,
		data: schema.parse(topic.data),
	} as const;
};
