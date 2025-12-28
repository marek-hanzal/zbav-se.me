import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
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
	const textQuery = database.selectFrom("message_text as message_text").select((eb) => [
		"message_text.id",
		sql<MessageTypeEnumSchema.Type>`'text'`.as("type"),
		"message_text.createdAt",
		jsonObjectFrom(
			withMessageTextSelect({
				database,
				sort: undefined,
				userId,
			}).where("mt.id", "=", eb.ref("message_text.id")),
		)
			.$notNull()
			.$castTo<unknown>()
			.as("payload"),
	]);

	const galleryQuery = database.selectFrom("message_gallery as message_gallery").select((eb) => [
		"message_gallery.id",
		sql<MessageTypeEnumSchema.Type>`'gallery'`.as("type"),
		"message_gallery.createdAt",
		jsonObjectFrom(
			withMessageGallerySelect({
				database,
				sort: undefined,
				userId,
			}).where("mg.id", "=", eb.ref("message_gallery.id")),
		)
			.$notNull()
			.$castTo<unknown>()
			.as("payload"),
	]);

	const locationQuery = database
		.selectFrom("message_location as message_location")
		.select((eb) => [
			"message_location.id",
			sql<MessageTypeEnumSchema.Type>`'location'`.as("type"),
			"message_location.createdAt",
			jsonObjectFrom(
				withMessageLocationSelect({
					database,
					sort: undefined,
					userId,
				}).where("ml.id", "=", eb.ref("message_location.id")),
			)
				.$notNull()
				.$castTo<unknown>()
				.as("payload"),
		]);

	const personalQuery = database
		.selectFrom("message_personal as message_personal")
		.select((eb) => [
			"message_personal.id",
			sql<MessageTypeEnumSchema.Type>`'personal'`.as("type"),
			"message_personal.createdAt",
			jsonObjectFrom(
				withMessagePersonalSelect({
					database,
					sort: undefined,
					userId,
				}).where("mp.id", "=", eb.ref("message_personal.id")),
			)
				.$notNull()
				.$castTo<unknown>()
				.as("payload"),
		]);

	const systemQuery = database.selectFrom("message_system as message_system").select((eb) => [
		"message_system.id",
		sql<MessageTypeEnumSchema.Type>`'system'`.as("type"),
		"message_system.createdAt",
		jsonObjectFrom(
			withMessageSystemSelect({
				database,
				sort: undefined,
			}).where("ms.id", "=", eb.ref("message_system.id")),
		)
			.$notNull()
			.$castTo<unknown>()
			.as("payload"),
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
