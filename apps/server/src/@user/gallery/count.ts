import { createRoute } from "@hono/zod-openapi";
import { zodFx } from "@use-pico/common/schema";
import { Effect, Match } from "effect";
import { galleryCountFx } from "~/app/gallery/fx/galleryCountFx";
import { GalleryCountQuerySchema } from "~/app/gallery/schema/GalleryCountQuerySchema";
import { UserContextFx, UserContextProvider } from "~/auth/fx/UserContextFx";
import { DatabaseContextProvider } from "~/database/fx/DatabaseContextFx";
import type { Routes } from "~/hono/Routes";
import { CountSchema } from "~/schema/CountSchema";
import { NoticeSchema } from "~/schema/NoticeSchema";

export const withCountApi: Routes.Fn = async ({ userHono }) => {
	userHono.openapi(
		createRoute({
			method: "post",
			path: "/gallery/count",
			description: "Returns count of galleries based on provided query",
			operationId: "apiGalleryCount",
			request: {
				body: {
					content: {
						"application/json": {
							schema: GalleryCountQuerySchema,
						},
					},
				},
			},
			responses: {
				200: {
					content: {
						"application/json": {
							schema: CountSchema,
						},
					},
					description: "Return counts based on provided query",
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
				"gallery",
				"user",
			],
		}),
		async (c) => {
			return Effect.gen(function* () {
				const user = yield* UserContextFx;

				return c.json<CountSchema.Type, 200>(
					yield* zodFx({
						schema: CountSchema,
						dataFx: galleryCountFx({
							...c.req.valid("json"),
							scope: {
								userId: user.id,
							},
						}),
					}),
					200,
				);
			}).pipe(
				DatabaseContextProvider(c.get("database")),
				UserContextProvider(c.get("user")),
				//
				Effect.catchAll((e) => {
					return Effect.succeed(
						Match.value(e).pipe(
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
