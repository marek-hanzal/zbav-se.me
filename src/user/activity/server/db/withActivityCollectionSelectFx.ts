import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import { ActivityTypeEnumSchema } from "~/common/activity/enum/ActivityTypeEnumSchema";
import type { ActivityTableSchema } from "~/server/database/@table/ActivityTableSchema";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import { withActivitySelectFx } from "~/user/activity/server/db/withActivitySelectFx";
import type { ActivitySortSchema } from "~/user/activity/server/schema/ActivitySortSchema";

const messageActivityTypes = [
	ActivityTypeEnumSchema.enum["buyer-message"],
	ActivityTypeEnumSchema.enum["seller-message"],
] as const;

export namespace withActivityCollectionSelectFx {
	export interface Props {
		sort?: ActivitySortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withActivityCollectionSelectFx>>;
}

export const withActivityCollectionSelectFx = Effect.fn("withActivityCollectionSelectFx")(
	function* ({ sort }: withActivityCollectionSelectFx.Props) {
		const { kysely } = yield* KyselyContextFx;
		const sourceSelect = yield* withActivitySelectFx({});

		let query = kysely
			.selectFrom(
				sourceSelect
					.select((eb) =>
						sql<number>`row_number() over (
						partition by case
							when ${eb.ref("i.type")} = any(array[${sql.join(messageActivityTypes)}]::activity_type_enum[])
								then ${eb.ref("i.payload")} ->> 'transactionId'
							else ${eb.ref("i.id")}
						end
						order by ${eb.ref("i.timestamp")} desc, ${eb.ref("i.id")} desc
					)`.as("rn"),
					)
					.as("i"),
			)
			.select([
				"i.id",
				"i.userId",
				"i.reference",
				"i.timestamp",
				"i.family",
				"i.priority",
				"i.archivedAt",
				"i.type",
				"i.payload",
			])
			.where("i.rn", "=", 1)
			.$castTo<ActivityTableSchema.Type>();

		for (const item of sort ?? []) {
			query = match(item.field)
				.with("timestamp", () => query.orderBy("i.timestamp", item.order))
				.with("archivedAt", () => query.orderBy("i.archivedAt", item.order))
				.with("priority", () => query.orderBy("i.priority", item.order))
				.exhaustive();
		}

		return query;
	},
);
