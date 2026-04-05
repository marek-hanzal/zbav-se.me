import { createOpenAICompatible } from "@ai-sdk/openai-compatible";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { Effect } from "effect";
import { z } from "zod";
import { DateContextFx } from "@/lib/common/date";
import { genId } from "@/lib/common/gen-id";
import { toolKnowledge } from "~/public/assistant/knowledge/tool/toolKnowledge";
import { toolKnowledgeIndex } from "~/public/assistant/knowledge/tool/toolKnowledgeIndex";
import { toolKnowledgeSearch } from "~/public/assistant/knowledge/tool/toolKnowledgeSearch";
import { SystemPrompt } from "~/public/assistant/SystemPrompt";
import { MessageSchema } from "~/public/assistant/schema/MessageSchema";
import { toolDraftCollection } from "~/seller/draft/server/tool/toolDraftCollection";
import { toolDraftCount } from "~/seller/draft/server/tool/toolDraftCount";
import { toolDraftCreate } from "~/seller/draft/server/tool/toolDraftCreate";
import { toolDraftDelete } from "~/seller/draft/server/tool/toolDraftDelete";
import { toolDraftFetch } from "~/seller/draft/server/tool/toolDraftFetch";
import { toolDraftPatch } from "~/seller/draft/server/tool/toolDraftPatch";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { tryDbFx } from "~/server/database/fx/tryDbFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { withTransactionFx } from "~/server/database/fx/withTransactionFx";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
import { toolCategoryCollection } from "~/session/category/server/tool/toolCategoryCollection";
import { toolCategoryFetch } from "~/session/category/server/tool/toolCategoryFetch";
import { toolLocationAutocomplete } from "~/session/location/server/tool/toolLocationAutocomplete";

const tools = {
	"knowledge-index": toolKnowledgeIndex,
	"knowledge-search": toolKnowledgeSearch,
	knowledge: toolKnowledge,
	//
	"draft-collection": toolDraftCollection,
	"draft-fetch": toolDraftFetch,
	"draft-create": toolDraftCreate,
	"draft-patch": toolDraftPatch,
	"draft-delete": toolDraftDelete,
	"draft-count": toolDraftCount,
	//
	"location-autocomplete": toolLocationAutocomplete,
	//
	"category-collection": toolCategoryCollection,
	"category-fetch": toolCategoryFetch,
} as const;

export const ChatRequestSchema = z
	.looseObject({
		messages: z.array(
			MessageSchema.omit({
				id: true,
			}),
		),
	})
	.strip();

export const Route = createFileRoute("/api/assistant")({
	server: {
		middleware: [
			withUserMiddleware,
		],
		handlers: {
			async POST({ request, context: { user, database } }) {
				return Effect.gen(function* () {
					const dateContext = yield* DateContextFx;
					const { kysely } = yield* KyselyContextFx;

					const aiConfig = ServerAiSchema.parse(process.env);

					const provider = createOpenAICompatible({
						name: "kilo",
						baseURL: aiConfig.SERVER_AI_SERVER_URL,
						apiKey: aiConfig.SERVER_AI_TOKEN,
					});

					const { messages } = yield* Effect.promise(async () => {
						return ChatRequestSchema.parseAsync(await request.json());
					});

					yield* withTransactionFx(
						Effect.gen(function* () {
							yield* Effect.promise(async () => {
								return kysely
									.deleteFrom("assistant_chat")
									.where("userId", "=", user.id)
									.execute();
							});

							yield* tryDbFx(async () => {
								return kysely
									.insertInto("assistant_chat")
									.values(
										messages.map((message) => ({
											id: genId(),
											createdAt: dateContext.now().toJSDate().toISOString(),
											payload: message,
											userId: user.id,
										})),
									)
									.executeTakeFirstOrThrow();
							});
						}),
					);

					return streamText({
						model: provider.chatModel(aiConfig.SERVER_AI_MODEL),
						system: SystemPrompt,
						/**
						 * This app has limited subset of schemas, so we've to cheat types here
						 */
						messages: yield* Effect.promise(async () => {
							return convertToModelMessages(messages as UIMessage[]);
						}),
						tools,
						stopWhen: stepCountIs(8),
					}).toUIMessageStreamResponse();
				}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);
			},
		},
	},
});
