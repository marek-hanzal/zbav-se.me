import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../service/DatabaseContextFx";
import { UserContextFx } from "../../../service/UserContextFx";

export namespace listingIgnoreCreateFx {
	export interface Props {
		listingId: string;
		createdAt?: Date;
	}
}

export const listingIgnoreCreateFx = ({
	listingId,
	createdAt = new Date(),
}: listingIgnoreCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;
		const id = genId();

		return yield* Effect.promise(async () => {
			return database
				.insertInto("listing_ignore")
				.values({
					id,
					userId: user.id,
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

export type listingIgnoreCreateFx = ReturnType<typeof listingIgnoreCreateFx>;
