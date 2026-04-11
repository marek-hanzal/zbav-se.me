import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getIndexOf } from "@/lib/common/front";
import { getRootLogger } from "~/server/log/getRootLogger";
import { KnowledgeFrontSchema } from "~/user/knowledge/server/schema/KnowledgeFrontSchema";

const logger = getRootLogger([
	"service",
	"getKnowledgeIndex",
]);

export const getKnowledgeIndex = () => {
	logger.trace("Index of proxy for Knowledge Index");

	return getIndexOf({
		schema: KnowledgeFrontSchema,
		source: join(dirname(fileURLToPath(import.meta.url)), "../../content"),
	});
};
