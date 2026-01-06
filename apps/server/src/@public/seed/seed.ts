import { createRoute } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { SeedRequestSchema, seedFx } from "~/@public/seed/fx/seedFx";
import { TransactionContextProvider } from "~/@user/transaction/fx/TransactionContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withSeedApi: Routes.Fn = async ({ publicHono }) => {
	publicHono.openapi(
		createRoute({
			method: "post",
			path: "/seed",
			description: "Seed endpoint for user data",
			operationId: "apiSeed",
			request: {
				body: {
					content: {
						"application/json": {
							schema: SeedRequestSchema,
						},
					},
					description: "User data for seeding",
				},
			},
			responses: {
				201: {
					description: "Seed operation completed",
				},
				400: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Invalid request",
				},
				403: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "Access denied",
				},
				404: {
					content: {
						"application/json": {
							schema: NoticeSchema,
						},
					},
					description: "User not found",
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
				"misc",
				"public",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				return c.json(yield* seedFx(c.req.valid("json")), 201);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				TransactionContextProvider({
					expires: 7,
					extend: 3,
				}),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundErrorFx",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 404>(
										{
											type: "error",
											message: err.message,
										},
										404,
									);
								},
							),
							Match.when(
								{
									_tag: "InvalidRequestError",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 400>(
										{
											type: "error",
											message: err.message,
										},
										400,
									);
								},
							),
							Match.when(
								{
									_tag: "UnknownException",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: err.message,
										},
										500,
									);
								},
							),
							Match.when(
								{
									_tag: "RuntimeError",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 500>(
										{
											type: "error",
											message: err.message,
										},
										500,
									);
								},
							),
							Match.when(
								{
									_tag: "AccessDeniedError",
								},
								(err) => {
									return c.json<NoticeSchema.Type, 403>(
										{
											type: "error",
											message: err.message,
										},
										403,
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
