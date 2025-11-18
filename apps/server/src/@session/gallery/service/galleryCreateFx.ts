import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import type { WithDatabase } from "../../../database/WithDatabase";

export namespace galleryCreateFx {
	export interface Props {
		database: WithDatabase;
		userId: string;
		listingId: string;
		uploadIds: string[];
	}
}

export const galleryCreateFx = ({
	database,
	userId,
	listingId,
	uploadIds,
}: galleryCreateFx.Props) => {
	return Effect.gen(function* () {
		const now = new Date();

		yield* Effect.promise(async () => {
			return database
				.insertInto("gallery")
				.values(
					uploadIds.map((uploadId, index) => ({
						id: genId(),
						userId,
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
