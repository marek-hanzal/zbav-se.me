import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessagePackageSortSchema } from "~/app/message-package/schema/MessagePackageSortSchema";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessagePackageSelectFx {
	export interface Props {
		userId: string;
		sort?: MessagePackageSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessagePackageSelectFx>>;
}

export const withMessagePackageSelectFx = Effect.fn("withMessagePackageSelectFx")(function* ({
	userId,
	sort,
}: withMessagePackageSelectFx.Props) {
	const kysely = yield* KyselyContextFx;

	let query = kysely
		.selectFrom("message_package as mp")
		.selectAll("mp")
		.select(sql<"package">`'package'`.as("type"))
		.select((eb) => [
			eb
				.case()
				.when("mp.userId", "=", userId)
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
