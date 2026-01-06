import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";
import { draftPatchFx } from "./fx/draftPatchFx";
import { DraftPatchSchema } from "./schema/DraftPatchSchema";
import { DraftSchema } from "./schema/DraftSchema";

export const withPatchApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/draft/patch",
			description: "Update an existing draft",
			operationId: "apiDraftPatch",
			request: {
				body: {
					content: {
						"application/json": {
							schema: DraftPatchSchema,
						},
					},
					description: "Data for updating an existing draft",
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: DraftSchema,
						},
					},
					description: "The updated draft",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request",
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
				return c.json<DraftSchema.Type, 200>(yield* draftPatchFx(c.req.valid("json")), 200);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
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
									_tag: "UnknownException",
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
