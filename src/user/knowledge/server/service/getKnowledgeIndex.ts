import { frontOf } from "@/lib/common/front/frontOf";
import { getRootLogger } from "~/common/log/getRootLogger";
import { KnowledgeFrontSchema } from "~/user/knowledge/server/schema/KnowledgeFrontSchema";

const logger = getRootLogger([
	"knowledge",
	"service",
	"getKnowledgeIndex",
]);

let cache: Promise<getKnowledgeIndex.Type> | undefined;

export namespace getKnowledgeIndex {
	export type Type = frontOf.Type<KnowledgeFrontSchema>[];
}

const getKnowledgeSourceMap = () => {
	return import.meta.glob("/docs/knowledge/*.md", {
		query: "?raw",
		import: "default",
	}) as Record<string, () => Promise<string>>;
};

export const getKnowledgeIndex = async () => {
	logger.trace("Index of proxy for Knowledge Index");

	if (cache !== undefined) {
		logger.trace("Index - cache hit");
		return cache;
	}

	return (cache = Promise.resolve().then(async () => {
		const knowledgeSourceMap = getKnowledgeSourceMap();
		const keys = Object.keys(knowledgeSourceMap).sort((left: string, right: string) => {
			return left.localeCompare(right);
		});

		const index = await Promise.all(
			keys.map(async (key: string) => {
				const loader = knowledgeSourceMap[key];

				if (!loader) {
					throw new Error(`Knowledge asset "${key}" is missing.`);
				}

				const source = await loader();
				return frontOf({
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
