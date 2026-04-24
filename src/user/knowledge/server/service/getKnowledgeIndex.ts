import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getIndexOf } from "@/lib/common/front";
import { getRootLogger } from "~/common/log/getRootLogger";
import { KnowledgeFrontSchema } from "~/user/knowledge/server/schema/KnowledgeFrontSchema";

const logger = getRootLogger([
	"knowledge",
	"service",
	"getKnowledgeIndex",
]);

let cache: getKnowledgeIndex.Type | undefined;

export namespace getKnowledgeIndex {
	export type Type = getIndexOf.Type<KnowledgeFrontSchema>;
}

export const getKnowledgeIndex = () => {
	logger.trace("Index of proxy for Knowledge Index");

	if (cache !== undefined) {
		logger.trace("Index - cache hit", {
			index: cache.map((item) => item.data.key),
		});
		return cache;
	}

	cache = getIndexOf({
		schema: KnowledgeFrontSchema,
		source: join(dirname(fileURLToPath(import.meta.url)), "../../../../../docs/knowledge"),
	});

	logger.trace("Index - cache miss", {
		index: cache.map((item) => item.data.key),
	});

	return cache;
};
