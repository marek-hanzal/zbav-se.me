import { Effect } from "effect";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { getLoggerFx } from "@/lib/common/log";
import { KyselyContextFx } from "~/server/database/context/KyselyContextFx";

export namespace categoryFieldsFx {
	export interface Props {
		categoryId: string;
	}
}

export const categoryFieldsFx = Effect.fn("categoryFieldsFx")(function* ({
	categoryId,
}: categoryFieldsFx.Props) {
	const logger = yield* getLoggerFx("categoryFieldsFx");
	logger.trace("categoryFieldsFx", {
		categoryId,
	});

	const { kysely } = yield* KyselyContextFx;

	return yield* Effect.promise(async () => {
		return kysely
			.selectFrom("category_field as cf")
			.innerJoin("field as f", "f.name", "cf.fieldId")
			.select([
				"f.name",
				"f.type",
				(eb) => {
					return eb.fn.coalesce("cf.required", eb.ref("f.required")).as("required");
				},
				(eb) => {
					return jsonArrayFrom(
						eb
							.selectFrom("field_option as fo")
							.select([
								"fo.fieldId",
								"fo.value",
								"fo.sort",
							])
							.whereRef("fo.fieldId", "=", "cf.fieldId")
							.orderBy("fo.sort", "asc"),
					).as("options");
				},
			])
			.where("cf.categoryId", "=", categoryId)
			.orderBy("cf.sort", "asc")
			.execute();
	});
});

export type categoryFieldsFx = ReturnType<typeof categoryFieldsFx>;
