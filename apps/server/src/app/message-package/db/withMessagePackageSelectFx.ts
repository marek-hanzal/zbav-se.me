import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessagePackageSortSchema } from "~/app/message-package/schema/MessagePackageSortSchema";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withMessagePackageSelectFx {
	export interface Props {
		sort?: MessagePackageSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessagePackageSelectFx>>;
}

export const withMessagePackageSelectFx = Effect.fn("withMessagePackageSelectFx")(function* ({
	sort,
}: withMessagePackageSelectFx.Props) {
	const database = yield* DatabaseContextFx;
	const user = yield* UserContextFx;

	let query = database
		.selectFrom("message_package as mp")
		.selectAll("mp")
		.select(sql<"package">`'package'`.as("type"))
		.select((eb) => [
			eb
				.case()
				.when("mp.userId", "=", user.id)
				.then<MessageDirectionEnumSchema.Type>("out")
				.else<MessageDirectionEnumSchema.Type>("in")
				.end()
				.as("direction"),
		]);

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("mp.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
