import { Effect } from "effect";
import { sql } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace userEventSourceFx {
	export interface Props {
		/**
		 * The user ID to fetch events for
		 */
		userId: string;
		/**
		 * Number of days to look back from the current time
		 */
		cutoff: number;
	}
}

/**
 * Retrieves raw user event data for post-processing to compute various user-related behavioral metrics.
 *
 * This method queries user events within a specified time window (cutoff days) for a given user.
 * The returned data is intended for further processing to calculate behavioral analytics.
 *
 * @param props - Configuration object
 * @returns An Effect that resolves to raw user event data
 *
 * @note This is an unsafe method. The userId parameter does not get checked, so anybody can get
 * information about anybody if this method is used in the wrong way. Ensure proper authorization
 * checks are performed before calling this method.
 */
export const userEventSourceFx = ({ userId, cutoff }: userEventSourceFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;

		return yield* Effect.promise(async () => {
			return database
				.with("slice", (db) =>
					db
						.selectFrom("user_event as ue")
						.selectAll("ue")
						.where("ue.userId", "=", userId)
						.where(
							"ue.createdAt",
							">=",
							sql<Date>`now() - make_interval(days => ${cutoff})`,
						),
				)
				.selectNoFrom((qb) => [
					jsonArrayFrom(
						qb
							.selectFrom("slice as s")
							.selectAll("s")
							.orderBy("s.group", "asc")
							.orderBy("s.createdAt", "asc"),
					).as("events"),
				])
				.executeTakeFirstOrThrow();
		});
	});
};
