import { tool } from "@openai/agents";
import { stringify } from "csv-stringify/sync";
import { z } from "zod";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { getKnowledgeIndexFn } from "~/user-knowledge/service/getKnowledgeIndexFn";

const logger = getRootLoggerFn([
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
	parameters: InputSchema,
	async execute(input) {
		logger.trace("toolKnowledgeBrowse", {
			input,
		});

		const _data = await InputSchema.parseAsync(input);

		return stringify(
			(await getKnowledgeIndexFn()).map(({ data }) => {
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
