import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessagePackageSortSchema } from "~/app/message-package/schema/MessagePackageSortSchema";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessagePackageSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessagePackageSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withMessagePackageSelect>;
}

export const withMessagePackageSelect = ({
	database,
	sort,
	userId,
}: withMessagePackageSelect.Props) => {
	let query = database
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
};
