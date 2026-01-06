import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessagePayloadSchema } from "~/@user/message/schema/MessagePayloadSchema";
import type { MessageSortSchema } from "~/app/message/schema/MessageSortSchema";
import type { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { withMessageGallerySelectFx } from "~/app/message-gallery/db/withMessageGallerySelectFx";
import { withMessageLocationSelectFx } from "~/app/message-location/db/withMessageLocationSelectFx";
import { withMessagePackageSelectFx } from "~/app/message-package/db/withMessagePackageSelectFx";
import { withMessagePersonalSelectFx } from "~/app/message-personal/db/withMessagePersonalSelectFx";
import { withMessageSystemSelectFx } from "~/app/message-system/db/withMessageSystemSelectFx";
import { withMessageTextSelectFx } from "~/app/message-text/db/withMessageTextSelectFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";

export namespace withMessageSelectFx {
	export interface Props {
		sort?: MessageSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageSelectFx>>;
}

export const withMessageSelectFx = Effect.fn("withMessageSelectFx")(function* ({
	sort,
}: withMessageSelectFx.Props) {
	const database = yield* DatabaseContextFx;

	const textSelect = yield* withMessageTextSelectFx({});
	const gallerySelect = yield* withMessageGallerySelectFx({});
	const locationSelect = yield* withMessageLocationSelectFx({});
	const personalSelect = yield* withMessagePersonalSelectFx({});
	const packageSelect = yield* withMessagePackageSelectFx({});
	const systemSelect = yield* withMessageSystemSelectFx({});

	const textQuery = database.selectFrom(textSelect.as("t")).select([
		"t.id",
		"t.messageThreadId",
		"t.userId",
		sql<MessageTypeEnumSchema.Type>`'text'`.as("type"),
		"t.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(t)`.as("payload"),
	]);

	const galleryQuery = database.selectFrom(gallerySelect.as("g")).select([
		"g.id",
		"g.messageThreadId",
		"g.userId",
		sql<MessageTypeEnumSchema.Type>`'gallery'`.as("type"),
		"g.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(g)`.as("payload"),
	]);

	const locationQuery = database.selectFrom(locationSelect.as("l")).select([
		"l.id",
		"l.messageThreadId",
		"l.userId",
		sql<MessageTypeEnumSchema.Type>`'location'`.as("type"),
		"l.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(l)`.as("payload"),
	]);

	const personalQuery = database.selectFrom(personalSelect.as("p")).select([
		"p.id",
		"p.messageThreadId",
		"p.userId",
		sql<MessageTypeEnumSchema.Type>`'personal'`.as("type"),
		"p.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(p)`.as("payload"),
	]);

	const packageQuery = database.selectFrom(packageSelect.as("pk")).select([
		"pk.id",
		"pk.messageThreadId",
		"pk.userId",
		sql<MessageTypeEnumSchema.Type>`'package'`.as("type"),
		"pk.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(pk)`.as("payload"),
	]);

	const systemQuery = database.selectFrom(systemSelect.as("s")).select([
		"s.id",
		"s.messageThreadId",
		sql<string>`'system'`.as("userId"),
		sql<MessageTypeEnumSchema.Type>`'system'`.as("type"),
		"s.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(s)`.as("payload"),
	]);

	const unionQuery = textQuery
		.unionAll(galleryQuery)
		.unionAll(locationQuery)
		.unionAll(personalQuery)
		.unionAll(packageQuery)
		.unionAll(systemQuery);

	let query = database.selectFrom(unionQuery.as("msg")).selectAll("msg");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("id", () => query.orderBy("msg.id", item.direction))
			.with("createdAt", () => query.orderBy("msg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
