import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { listingIgnoreFetchFx } from "./listingIgnoreFetchFx";

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

		yield* Effect.tryPromise(async () => {
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

		return yield* listingIgnoreFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type listingIgnoreCreateFx = ReturnType<typeof listingIgnoreCreateFx>;
