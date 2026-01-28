import { Effect } from "effect";
import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessagePayloadSchema } from "~/@user/message/schema/MessagePayloadSchema";
import type { MessageSortSchema } from "~/@user/message/schema/MessageSortSchema";
import type { MessageTypeEnumSchema } from "~/@user/message/schema/MessageTypeEnumSchema";
import { withMessageGallerySelectFx } from "~/@user/message-gallery/db/withMessageGallerySelectFx";
import { withMessageLocationSelectFx } from "~/@user/message-location/db/withMessageLocationSelectFx";
import { withMessagePackageSelectFx } from "~/@user/message-package/db/withMessagePackageSelectFx";
import { withMessagePersonalSelectFx } from "~/@user/message-personal/db/withMessagePersonalSelectFx";
import { withMessageSystemSelectFx } from "~/@user/message-system/db/withMessageSystemSelectFx";
import { withMessageTextSelectFx } from "~/@user/message-text/db/withMessageTextSelectFx";
import { KyselyContextFx } from "~/database/context/KyselyContextFx";

export namespace withMessageSourceSelectFx {
	export interface Props {
		userId: string;
		sort?: MessageSortSchema.Type[];
	}

	export type Select = Effect.Effect.Success<ReturnType<typeof withMessageSourceSelectFx>>;
}

export const withMessageSourceSelectFx = Effect.fn("withMessageSourceSelectFx")(function* ({
	userId,
	sort,
}: withMessageSourceSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

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

	let query = kysely.selectFrom(unionQuery.as("msg"));

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("id", () => query.orderBy("msg.id", item.direction))
			.with("createdAt", () => query.orderBy("msg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
});
