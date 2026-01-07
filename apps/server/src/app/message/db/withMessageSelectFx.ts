import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessagePayloadSchema } from "~/app/message/schema/MessagePayloadSchema";
import type { MessageSortSchema } from "~/app/message/schema/MessageSortSchema";
import type { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { withMessageGallerySelectFx } from "~/app/message-gallery/db/withMessageGallerySelectFx";
import { withMessageLocationSelectFx } from "~/app/message-location/db/withMessageLocationSelectFx";
import { withMessagePackageSelectFx } from "~/app/message-package/db/withMessagePackageSelectFx";
import { withMessagePersonalSelectFx } from "~/app/message-personal/db/withMessagePersonalSelectFx";
import { withMessageSystemSelectFx } from "~/app/message-system/db/withMessageSystemSelectFx";
import { withMessageTextSelectFx } from "~/app/message-text/db/withMessageTextSelectFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessageSelectFx {
	export interface Props {
		userId: string;
		sort?: MessageSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageSelectFx>>;
}

export const withMessageSelectFx = Effect.fn("withMessageSelectFx")(function* ({
	userId,
	sort,
}: withMessageSelectFx.Props) {
	const kysely = yield* KyselyContextFx;

	const textSelect = yield* withMessageTextSelectFx({
		userId,
	});
	const gallerySelect = yield* withMessageGallerySelectFx({
		userId,
	});
	const locationSelect = yield* withMessageLocationSelectFx({
		userId,
	});
	const personalSelect = yield* withMessagePersonalSelectFx({
		userId,
	});
	const packageSelect = yield* withMessagePackageSelectFx({
		userId,
	});
	const systemSelect = yield* withMessageSystemSelectFx({});

	const textQuery = kysely.selectFrom(textSelect.as("t")).select([
		"t.id",
		"t.messageThreadId",
		"t.userId",
		sql<MessageTypeEnumSchema.Type>`'text'`.as("type"),
		"t.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(t)`.as("payload"),
	]);

	const galleryQuery = kysely.selectFrom(gallerySelect.as("g")).select([
		"g.id",
		"g.messageThreadId",
		"g.userId",
		sql<MessageTypeEnumSchema.Type>`'gallery'`.as("type"),
		"g.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(g)`.as("payload"),
	]);

	const locationQuery = kysely.selectFrom(locationSelect.as("l")).select([
		"l.id",
		"l.messageThreadId",
		"l.userId",
		sql<MessageTypeEnumSchema.Type>`'location'`.as("type"),
		"l.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(l)`.as("payload"),
	]);

	const personalQuery = kysely.selectFrom(personalSelect.as("p")).select([
		"p.id",
		"p.messageThreadId",
		"p.userId",
		sql<MessageTypeEnumSchema.Type>`'personal'`.as("type"),
		"p.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(p)`.as("payload"),
	]);

	const packageQuery = kysely.selectFrom(packageSelect.as("pk")).select([
		"pk.id",
		"pk.messageThreadId",
		"pk.userId",
		sql<MessageTypeEnumSchema.Type>`'package'`.as("type"),
		"pk.createdAt",
		sql<MessagePayloadSchema.Type>`to_jsonb(pk)`.as("payload"),
	]);

	const systemQuery = kysely.selectFrom(systemSelect.as("s")).select([
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

	let query = kysely.selectFrom(unionQuery.as("msg")).selectAll("msg");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("id", () => query.orderBy("msg.id", item.direction))
			.with("createdAt", () => query.orderBy("msg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
