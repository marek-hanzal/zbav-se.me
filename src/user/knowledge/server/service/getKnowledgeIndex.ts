import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getIndexOf } from "@/lib/common/front";
import { getRootLogger } from "~/server/log/getRootLogger";
import { KnowledgeFrontSchema } from "~/user/knowledge/server/schema/KnowledgeFrontSchema";

const logger = getRootLogger([
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
		return cache;
	}

	cache = getIndexOf({
		schema: KnowledgeFrontSchema,
		source: join(dirname(fileURLToPath(import.meta.url)), "../../../../../docs"),
	});

	logger.trace("Index", {
		index: cache.map((item) => item.data.key),
	});

	return cache;
};
