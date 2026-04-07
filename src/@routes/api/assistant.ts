import { createFileRoute } from "@tanstack/react-router";
import { Effect } from "effect";
import { DateContextFx } from "@/lib/common/date";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withDateFx } from "~/server/database/fx/withDateFx";
import { withKyselyFx } from "~/server/database/fx/withKyselyFx";
import { ServerAiSchema } from "~/server/env/ServerAiSchema";
import { withUserMiddleware } from "~/server/middleware/withUserMiddleware";
export const Route = createFileRoute("/api/assistant")({
	server: {
		middleware: [
			withUserMiddleware,
		],
		handlers: {
			async POST({ request, context: { user, database, rootLogger } }) {
				const logger = rootLogger.getChild("/api/assistant");

				return Effect.gen(function* () {
					const dateContext = yield* DateContextFx;
					const { kysely } = yield* KyselyContextFx;

					const aiConfig = ServerAiSchema.parse(process.env);

					return Response.json({
						error: "not yet",
					});
				}).pipe(withKyselyFx(database), withDateFx, Effect.runPromise);
			},
		},
	},
});
