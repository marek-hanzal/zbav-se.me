import { sql } from "kysely";
import { match } from "ts-pattern";
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
	const textPayload = withMessageTextSelect({
		database,
		sort: undefined,
		userId,
	}).as("t");
	const textQuery = database.selectFrom(textPayload).select([
		"t.id",
		sql<MessageTypeEnumSchema.Type>`'text'`.as("type"),
		"t.createdAt",
		sql<unknown>`to_jsonb(t)`.as("payload"),
	]);

	const galleryPayload = withMessageGallerySelect({
		database,
		sort: undefined,
		userId,
	}).as("g");
	const galleryQuery = database.selectFrom(galleryPayload).select([
		"g.id",
		sql<MessageTypeEnumSchema.Type>`'gallery'`.as("type"),
		"g.createdAt",
		sql<unknown>`to_jsonb(g)`.as("payload"),
	]);

	const locationPayload = withMessageLocationSelect({
		database,
		sort: undefined,
		userId,
	}).as("l");
	const locationQuery = database.selectFrom(locationPayload).select([
		"l.id",
		sql<MessageTypeEnumSchema.Type>`'location'`.as("type"),
		"l.createdAt",
		sql<unknown>`to_jsonb(l)`.as("payload"),
	]);

	const personalPayload = withMessagePersonalSelect({
		database,
		sort: undefined,
		userId,
	}).as("p");
	const personalQuery = database.selectFrom(personalPayload).select([
		"p.id",
		sql<MessageTypeEnumSchema.Type>`'personal'`.as("type"),
		"p.createdAt",
		sql<unknown>`to_jsonb(p)`.as("payload"),
	]);

	const systemPayload = withMessageSystemSelect({
		database,
		sort: undefined,
	}).as("s");
	const systemQuery = database.selectFrom(systemPayload).select([
		"s.id",
		sql<MessageTypeEnumSchema.Type>`'system'`.as("type"),
		"s.createdAt",
		sql<unknown>`to_jsonb(s)`.as("payload"),
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
