import { createRoute, z } from "@hono/zod-openapi";
import { Effect, Match } from "effect";
import { DatabaseContextFx, DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import { NotFoundError } from "~/error/NotFoundError";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";

const SeedRequestSchema = z.object({
	user: z.string().openapi({
		description: "User data for seeding",
	}),
});

type SeedRequestSchema = typeof SeedRequestSchema;

namespace SeedRequestSchema {
	export type Type = z.infer<typeof SeedRequestSchema>;
}

const seedFx = (input: SeedRequestSchema.Type) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		const user = yield* Effect.tryPromise(async () => {
			return database
				.selectFrom("user")
				.where("email", "=", input.user)
				.selectAll()
				.executeTakeFirst();
		});

		if (!user) {
			return yield* new NotFoundError({
				resource: "user",
				resourceId: input.user,
				message: "User not found",
			});
		}

		return yield* Effect.void;
	});
};

export const withSeedApi: Routes.Fn = ({ publicHono }) => {
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
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
							Match.when(
								{
									_tag: "NotFoundError",
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
