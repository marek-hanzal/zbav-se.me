import { createRoute, z } from "@hono/zod-openapi";
import { Effect } from "effect";
import { DatabaseContextFx, DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { NoticeSchema } from "~/schema/NoticeSchema";

const SeedRequestSchema = z.object({
	user: z.any().openapi({
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
				yield* seedFx(c.req.valid("json"));
				return c.json(
					{
						status: "success",
					},
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				Effect.catchAll(() => {
					return Effect.succeed(
						c.json<NoticeSchema.Type, 500>(
							{
								type: "error",
								message: "Internal server error",
							},
							500,
						),
					);
				}),
				Effect.runPromise,
			);
		},
	);
};
