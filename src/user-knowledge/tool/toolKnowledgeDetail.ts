import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { getKnowledgeIndexFn } from "~/user-knowledge/service/getKnowledgeIndexFn";

const logger = getRootLoggerFn([
	"knowledge",
	"tool",
	"toolKnowledgeDetail",
]);

const InputSchema = z
	.looseObject({
		topicId: z.string().min(1),
	})
	.strip();

export const toolKnowledgeDetail = tool({
	name: "knowledge-detail",
	needsApproval: false,
	description: `
Get the knowledge using 'topicId'

- Don't invent 'topicId', use tool 'knowledge-browse' to get relevant 'topicId'
- Be sure you need the detail as it may be content heavy
- You may use directly Related as 'topicId' for another 'knowledge-detail' call
    `.trim(),
	strict: true,
	parameters: InputSchema,
	async execute(input) {
		logger.trace("toolKnowledgeDetail", {
			input,
		});

		const { topicId } = await InputSchema.parseAsync(input);

		const topic = (await getKnowledgeIndexFn()).find(({ data: { key } }) => {
			return key === topicId;
		});

		if (!topic) {
			return "nothing";
		}

		return `
Title: ${topic.data.title}
Related: ${topic.data.related ? topic.data.related.join(" | ") : "none"}

Summary:
${topic.data.summary}

Content:
${topic.content}
        `;
	},
});
