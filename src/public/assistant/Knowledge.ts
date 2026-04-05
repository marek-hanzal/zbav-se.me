import matter from "gray-matter";
import { z } from "zod";
import earlyAccessContent from "~/public/assistant/knowledge/content/early-access.md?raw";
import earlyDeliveryContent from "~/public/assistant/knowledge/content/early-delivery.md?raw";
import messagesContent from "~/public/assistant/knowledge/content/messages.md?raw";
import releaseWindowContent from "~/public/assistant/knowledge/content/release-window.md?raw";
import transactionExpirationContent from "~/public/assistant/knowledge/content/transaction-expiration.md?raw";
import transactionsStatesContent from "~/public/assistant/knowledge/content/transactions-states.md?raw";

export namespace Knowledge {
	export type Index =
		| "transactions-states"
		| "messages"
		| "transaction-expiration"
		| "early-access"
		| "early-delivery"
		| "release-window";

	export interface Topic {
		key: string;
		title: string;
		summary: string;
		content: string;
		related?: Index[];
	}
}

const KnowledgeTopicKeys = [
	"transactions-states",
	"messages",
	"transaction-expiration",
	"early-access",
	"early-delivery",
	"release-window",
] as const;

const KnowledgeTopicKeySchema = z.enum(KnowledgeTopicKeys);

const KnowledgeTopicFrontMatterSchema = z.object({
	key: KnowledgeTopicKeySchema,
	title: z.string(),
	summary: z.string(),
	related: z.array(KnowledgeTopicKeySchema).optional(),
});

const parseKnowledgeTopic = (source: string): Knowledge.Topic => {
	const topic = matter(source);
	const data = KnowledgeTopicFrontMatterSchema.parse(topic.data);

	return {
		...data,
		content: topic.content.trim(),
	};
};

export const KnowledgeIndex = {
	"transactions-states": parseKnowledgeTopic(transactionsStatesContent),
	"transaction-expiration": parseKnowledgeTopic(transactionExpirationContent),
	"early-access": parseKnowledgeTopic(earlyAccessContent),
	"release-window": parseKnowledgeTopic(releaseWindowContent),
	messages: parseKnowledgeTopic(messagesContent),
	"early-delivery": parseKnowledgeTopic(earlyDeliveryContent),
} as const satisfies Record<Knowledge.Index, Knowledge.Topic>;

export type KnowledgeIndex = typeof KnowledgeIndex;
