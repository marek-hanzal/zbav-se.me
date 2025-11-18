import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";

export namespace listingFlagCreateFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
		createdAt?: Date;
	}
}

export const listingFlagCreateFx = ({
	database,
	userId,
	listingId,
	createdAt = new Date(),
}: listingFlagCreateFx.Props) => {
	return Effect.gen(function* () {
		const id = genId();

		return yield* Effect.promise(async () => {
			return database
				.insertInto("listing_flag")
				.values({
					id,
					userId,
					listingId,
					createdAt,
				})
				.onConflict((oc) =>
					oc
						.columns([
							"userId",
							"listingId",
						])
						.doNothing(),
				)
				.returningAll()
				.executeTakeFirst();
		});
	});
};

export type listingFlagCreateFx = ReturnType<typeof listingFlagCreateFx>;
