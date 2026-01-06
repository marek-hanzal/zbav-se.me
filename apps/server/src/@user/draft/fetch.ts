import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { draftFetchFx } from "~/app/draft/fx/draftFetchFx";
import { DraftQuerySchema } from "~/app/draft/schema/DraftQuerySchema";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { DraftSchema } from "./schema/DraftSchema";

export const withFetchApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/draft/fetch",
			description: "Return a draft based on the provided query",
			operationId: "apiDraftFetch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftQuerySchema,
						},
					},
					description: "Query object for draft fetch",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: DraftSchema,
						},
					},
					description: "Return a draft based on the provided query",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Draft not found",
				},
				500: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Internal server error",
				},
			},
			tags: [
				"draft",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json<DraftSchema.Type, 200>(
					yield* zodFx({
						schema: DraftSchema,
						dataFx: draftFetchFx({
							...c.req.valid("json"),
							scope: {
								userId: c.get("user").id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: e.message,
										},
										404,
									);
								},
							),
							Match.when(
								{
									_tag: "ZodErrorFx",
								},
								() => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: e.message,
										},
										500,
									);
								},
							),
							Match.exhaustive,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
