import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
	"knowledge",
	"tool",
	"toolKnowledgeBrowse",
]);

const InputSchema = z
	.looseObject({
		//
	})
	.strip();

export const toolKnowledgeBrowse = tool({
	name: "knowledge-browse",
	needsApproval: false,
	description: `
If you need to know some deep topic about the app, feature or anything else, use this tool.

Result is set of topics with summaries and 'topicId' you can use for 'knowledge-detail'

Related topics are array of 'topicId'; fetch only when needed to get really deep knowledge.
    `.trim(),
	strict: true,
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolKnowledgeBrowse", {
			input,
		});

		const _data = await InputSchema.parseAsync(input);

		return stringify(
			getKnowledgeIndex().map(({ data }) => {
				return {
					topicId: data.key,
					title: data.title,
					summary: data.summary,
					related: data.related ? data.related.join(" | ") : "none",
				};
			}),
			{
				header: true,
				delimiter: "\n",
				columns: [
					"topicId",
					"title",
					// "summary",
					"related",
				],
			},
		);
	},
});
