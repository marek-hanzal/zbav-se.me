import { getLogger } from "@logtape/logtape";
import matter from "gray-matter";
import type { z } from "zod";

const logger = getLogger([
	"lib",
	"common",
	"frontOf",
]);

export namespace frontOfFn {
	export interface Type<TSchema extends z.ZodType>
		extends Omit<matter.GrayMatterFile<string>, "data"> {
		data: z.infer<TSchema>;
	}

	export interface Props<TSchema extends z.ZodType> {
		schema: TSchema;
		source: string;
	}
}

export const frontOfFn = <TSchema extends z.ZodType>({
	schema,
	source,
}: frontOfFn.Props<TSchema>): frontOfFn.Type<TSchema> => {
	const topic = matter(source);

	logger.trace("frontOf", {
		data: topic.data,
	});

	return {
		...topic,
		data: schema.parse(topic.data),
	} as const;
};
