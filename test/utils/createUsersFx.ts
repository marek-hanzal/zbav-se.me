import { Effect } from "effect";
import type { auth } from "~/server/auth/auth";
import { createUserFx } from "~/test/utils/createUserFx";

export namespace createUsersFx {
	export interface Props {
		api: auth.Api["api"];
		slug: string;
	}
}

export const createUsersFx = Effect.fn("createUsersFx")(function* ({
	api,
	slug,
}: createUsersFx.Props) {
	const seller = yield* createUserFx({
		api,
		email: `${slug}-seller@test.cz`,
		name: `${slug} Seller`,
	});

	const buyer = yield* createUserFx({
		api,
		email: `${slug}-buyer@test.cz`,
		name: `${slug} Buyer`,
	});

	const stranger = yield* createUserFx({
		api,
		email: `${slug}-stranger@test.cz`,
		name: `${slug} Stranger`,
	});

	return {
		seller,
		buyer,
		stranger,
	};
});
