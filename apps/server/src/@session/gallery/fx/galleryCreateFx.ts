import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { DatabaseContextFx } from "../../../fx/DatabaseContextFx";
import { UserContextFx } from "../../../fx/UserContextFx";

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

		yield* Effect.promise(async () => {
			return database
				.insertInto("gallery")
				.values(
					uploadIds.map((uploadId, index) => ({
						id: genId(),
						userId: user.id,
						createdAt: now,
						listingId,
						uploadId,
						sort: index,
					})),
				)
				.execute();
		});
	});
};

export type galleryCreateFx = ReturnType<typeof galleryCreateFx>;
