import { genId } from "@use-pico/common/gen-id";
import { Effect } from "effect";
import { UserContextFx } from "~/auth/fx/UserContextFx";
import { DatabaseContextFx } from "~/database/fx/DatabaseContextFx";
import { InvalidRequestError } from "~/error/InvalidRequestError";

export namespace flagCreateFx {
	export interface Props {
		listingId: string;
	}
}

export const flagCreateFx = ({ listingId }: flagCreateFx.Props) => {
	return Effect.gen(function* () {
		const database = yield* DatabaseContextFx;
		const user = yield* UserContextFx;
		const id = genId();

		return yield* Effect.tryPromise({
			async try() {
				return database
					.insertInto("flag")
					.values({
						id,
						userId: user.id,
						listingId,
						createdAt: new Date(),
					})
					.returningAll()
					.executeTakeFirstOrThrow();
			},
			catch() {
				return new InvalidRequestError({
					message: "You have already flagged this listing",
				});
			},
		});
	});
};

export type flagCreateFx = ReturnType<typeof flagCreateFx>;
