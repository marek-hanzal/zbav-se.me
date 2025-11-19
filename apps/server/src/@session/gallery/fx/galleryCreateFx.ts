import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../database/fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";
import { galleryFetchFx } from "./galleryFetchFx";

export namespace galleryCreateFx {
	export interface Props {
		listingId: string;
		uploadIds: string[];
	}
}

export const galleryCreateFx = ({ listingId, uploadIds }: galleryCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;

		const now = new Date();
		const id = genId();

		yield* Effect.tryPromise(async () => {
			return database
				.insertInto("gallery")
				.values(
					uploadIds.map((uploadId, index) => ({
						id,
						userId: user.id,
						createdAt: now,
						listingId,
						uploadId,
						sort: index,
					})),
				)
				.execute();
		});

		return yield* galleryFetchFx({
			query: {
				where: {
					id,
				},
			},
		});
	});
};

export type galleryCreateFx = ReturnType<typeof galleryCreateFx>;
