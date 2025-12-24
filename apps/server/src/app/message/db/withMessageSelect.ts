import { sql } from "kysely";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { match } from "ts-pattern";
import { withGallerySelect } from "~/app/gallery/db/withGallerySelect";
import type { MessageDirectionEnumSchema } from "~/app/message/schema/MessageDirectionEnumSchema";
import type { MessageSortSchema } from "~/app/message/schema/MessageSortSchema";
import type { MessageTypeEnumSchema } from "~/app/message/schema/MessageTypeEnumSchema";
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
	const textQuery = database.selectFrom("message_text as mt").select((eb) => [
		"mt.id",
		"mt.messageThreadId",
		"mt.createdAt",
		sql<MessageTypeEnumSchema.Type>`'text'`.as("type"),
		"mt.userId",
		"mt.text",
		sql<string | null>`null`.as("galleryId"),
		sql<string | null>`null`.as("locationId"),
		sql<unknown>`null`.as("gallery"),
		eb
			.case()
			.when("mt.userId", "=", userId)
			.then<MessageDirectionEnumSchema.Type>("out")
			.else<MessageDirectionEnumSchema.Type>("in")
			.end()
			.as("direction"),
	]);

	const galleryQuery = database.selectFrom("message_gallery as mg").select((eb) => [
		"mg.id",
		"mg.messageThreadId",
		"mg.createdAt",
		sql<MessageTypeEnumSchema.Type>`'gallery'`.as("type"),
		"mg.userId",
		sql<string>`null`.as("text"),
		"mg.galleryId",
		sql<string | null>`null`.as("locationId"),
		jsonObjectFrom(
			withGallerySelect({
				database,
				sort: undefined,
			})
				.where("gal.id", "=", eb.ref("mg.galleryId"))
				.limit(1),
		)
			.$notNull()
			.as("gallery"),
		eb
			.case()
			.when("mg.userId", "=", userId)
			.then<MessageDirectionEnumSchema.Type>("out")
			.else<MessageDirectionEnumSchema.Type>("in")
			.end()
			.as("direction"),
	]);

	const locationQuery = database.selectFrom("message_location as ml").select((eb) => [
		"ml.id",
		"ml.messageThreadId",
		"ml.createdAt",
		sql<MessageTypeEnumSchema.Type>`'location'`.as("type"),
		"ml.userId",
		sql<string>`null`.as("text"),
		sql<string | null>`null`.as("galleryId"),
		"ml.locationId",
		sql<unknown>`null`.as("gallery"),
		eb
			.case()
			.when("ml.userId", "=", userId)
			.then<MessageDirectionEnumSchema.Type>("out")
			.else<MessageDirectionEnumSchema.Type>("in")
			.end()
			.as("direction"),
	]);

	const systemQuery = database.selectFrom("message_system as ms").select([
		"ms.id",
		"ms.messageThreadId",
		"ms.createdAt",
		sql<MessageTypeEnumSchema.Type>`'system'`.as("type"),
		sql<string>`''`.as("userId"),
		"ms.text",
		sql<string | null>`null`.as("galleryId"),
		sql<string | null>`null`.as("locationId"),
		sql<unknown>`null`.as("gallery"),
		sql<MessageDirectionEnumSchema.Type>`'system'`.as("direction"),
	]);

	const unionQuery = textQuery
		.unionAll(galleryQuery)
		.unionAll(locationQuery)
		.unionAll(systemQuery);

	let query = database.selectFrom(unionQuery.as("msg")).selectAll("msg");

	for (const item of sort ?? []) {
		query = match(item.field)
			.with("createdAt", () => query.orderBy("msg.createdAt", item.direction))
			.exhaustive();
	}

	return query;
};
