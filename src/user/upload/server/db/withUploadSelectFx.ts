import { Effect } from "effect";
import { match } from "ts-pattern";
import { selectFx } from "@/lib/common/select";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";
import type { UploadFilterSchema } from "../schema/UploadFilterSchema";
import type { UploadSortSchema } from "../schema/UploadSortSchema";

export namespace withUploadSelectFx {
	export interface Props {
		sort?: UploadSortSchema.Type[];
	}
}

export const withUploadSelectFx = Effect.fn("withUploadSelectFx")(function* ({
	sort,
}: withUploadSelectFx.Props) {
	const { kysely } = yield* KyselyContextFx;

	let select = kysely.selectFrom("upload as u");

	for (const item of sort ?? []) {
		select = match(item.field)
			.with("createdAt", () => select.orderBy("u.createdAt", item.order))
			.exhaustive();
	}

	return selectFx({
		select: select.select([
			"u.id",
			"u.url",
		]),
		queryFx(select, where: UploadFilterSchema.Type) {
			return Effect.gen(function* () {
				let query = select;

				if (!where) {
					return yield* Effect.succeed(select);
				}

				if (where.id) {
					query = query.where("u.id", "=", where.id);
				}

				if (where.idIn && where.idIn.length > 0) {
					query = query.where("u.id", "in", where.idIn);
				}

				if (where.userId) {
					query = query.where("u.userId", "=", where.userId);
				}

				if (where.access) {
					query = query.where("u.access", "=", where.access);
				}

				return yield* Effect.succeed(query);
			});
		},
	});
});
