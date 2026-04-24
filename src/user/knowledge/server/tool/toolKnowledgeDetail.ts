import { tool } from "@openai/agents";
import { z } from "zod";
import { getRootLogger } from "~/common/log/getRootLogger";
import { unsafeJsonSchema } from "~/server/openai/unsafeJsonSchema";
import { getKnowledgeIndex } from "~/user/knowledge/server/service/getKnowledgeIndex";

const logger = getRootLogger([
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
	parameters: unsafeJsonSchema(InputSchema),
	async execute(input) {
		logger.trace("toolKnowledgeDetail", {
			input,
		});

		const { topicId } = await InputSchema.parseAsync(input);

		const topic = getKnowledgeIndex().find(({ data: { key } }) => {
			return key === topicId;
		});

		if (!topic) {
			return "nothing";
		}

		return `
Title: ${topic.data.title}
Related: ${topic.data.related ? topic.data.related.join(" | ") : "none"}
Content:
${topic.content}
        `;
	},
});
