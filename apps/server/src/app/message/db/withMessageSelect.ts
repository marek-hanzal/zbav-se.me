import { sql } from "kysely";
import { match } from "ts-pattern";
import type { MessagePayloadSchema } from "~/@user/message/schema/MessagePayloadSchema";
import type { MessageSortSchema } from "~/app/message/schema/MessageSortSchema";
import type { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
import { withMessageGallerySelect } from "~/app/message-gallery/db/withMessageGallerySelect";
import { withMessageLocationSelect } from "~/app/message-location/db/withMessageLocationSelect";
import { withMessagePersonalSelect } from "~/app/message-personal/db/withMessagePersonalSelect";
import { withMessageSystemSelect } from "~/app/message-system/db/withMessageSystemSelect";
import { withMessageTextSelect } from "~/app/message-text/db/withMessageTextSelect";
import type { WithDatabase } from "~/database/WithDatabase";

export namespace withMessageSelect {
	export interface Props {
		database: WithDatabase;
		sort: MessageSortSchema.Type[] | undefined;
		userId: string;
	}

	export type Select = ReturnType<typeof withMessageSelect>;
}

export const withMessageSelect = ({ database, sort, userId }: withMessageSelect.Props) => {
	const textQuery = database
		.selectFrom(
			withMessageTextSelect({
				database,
				sort: undefined,
				userId,
			}).as("t"),
		)
		.select([
			"t.id",
			"t.messageThreadId",
			sql<MessageTypeEnumSchema.Type>`'text'`.as("type"),
			"t.createdAt",
			sql<MessagePayloadSchema.Type>`to_jsonb(t)`.as("payload"),
		]);

	const galleryQuery = database
		.selectFrom(
			withMessageGallerySelect({
				database,
				sort: undefined,
				userId,
			}).as("g"),
		)
		.select([
			"g.id",
			"g.messageThreadId",
			sql<MessageTypeEnumSchema.Type>`'gallery'`.as("type"),
			"g.createdAt",
			sql<MessagePayloadSchema.Type>`to_jsonb(g)`.as("payload"),
		]);

	const locationQuery = database
		.selectFrom(
			withMessageLocationSelect({
				database,
				sort: undefined,
				userId,
			}).as("l"),
		)
		.select([
			"l.id",
			"l.messageThreadId",
			sql<MessageTypeEnumSchema.Type>`'location'`.as("type"),
			"l.createdAt",
			sql<MessagePayloadSchema.Type>`to_jsonb(l)`.as("payload"),
		]);

	const personalQuery = database
		.selectFrom(
			withMessagePersonalSelect({
				database,
				sort: undefined,
				userId,
			}).as("p"),
		)
		.select([
			"p.id",
			"p.messageThreadId",
			sql<MessageTypeEnumSchema.Type>`'personal'`.as("type"),
			"p.createdAt",
			sql<MessagePayloadSchema.Type>`to_jsonb(p)`.as("payload"),
		]);

	const systemQuery = database
		.selectFrom(
			withMessageSystemSelect({
				database,
				sort: undefined,
			}).as("s"),
		)
		.select([
			"s.id",
			"s.messageThreadId",
			sql<MessageTypeEnumSchema.Type>`'system'`.as("type"),
			"s.createdAt",
			sql<MessagePayloadSchema.Type>`to_jsonb(s)`.as("payload"),
		]);

	const unionQuery = textQuery
		.unionAll(galleryQuery)
		.unionAll(locationQuery)
		.unionAll(personalQuery)
		.unionAll(systemQuery);

	let query = database.selectFrom(unionQuery.as("msg")).selectAll("msg");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("id", () => query.orderBy("msg.id", item.direction))
			.with("createdAt", () => query.orderBy("msg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
