import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { getIndexOf } from "@/lib/common/front";
import { KnowledgeFrontSchema } from "~/public/assistant/knowledge/schema/KnowledgeFrontSchema";

export const getKnowledgeIndex = () => {
	return getIndexOf({
		schema: KnowledgeFrontSchema,
		source: join(dirname(fileURLToPath(import.meta.url)), "../content"),
	});
};
