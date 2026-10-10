import { frontOfFn } from "~/database-query/fn/frontOfFn";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { KnowledgeFrontSchema } from "~/user-knowledge/schema/KnowledgeFrontSchema";

const logger = getRootLoggerFn([
	"knowledge",
	"service",
	"getKnowledgeIndex",
]);

let cache: Promise<getKnowledgeIndexFn.Type> | undefined;

export namespace getKnowledgeIndexFn {
	export type Type = frontOfFn.Type<KnowledgeFrontSchema>[];
}

export const getKnowledgeIndexFn = async () => {
	logger.trace("Index of proxy for Knowledge Index");

	if (cache !== undefined) {
		logger.trace("Index - cache hit");
		return cache;
	}

	return (cache = Promise.resolve().then(async () => {
		const knowledgeSourceMap = import.meta.glob("/docs/knowledge/*.md", {
			query: "?raw",
			import: "default",
		}) as Record<string, () => Promise<string>>;
		const keys = Object.keys(knowledgeSourceMap).sort((left: string, right: string) => {
			return left.localeCompare(right);
		});

		const index = await Promise.all(
			keys.map(async (key: string) => {
				const loaderFn = knowledgeSourceMap[key];

				if (!loaderFn) {
					throw new Error(`Knowledge asset "${key}" is missing.`);
				}

				const source = await loaderFn();
				return frontOfFn({
					schema: KnowledgeFrontSchema,
					source,
				});
			}),
		);

		logger.trace("Index - cache miss", {
			index: index.map((item) => item.data.key),
		});

		return index;
	}));
};
