import { Effect } from "effect";
import { leaseTestUserFx } from "~/test/user/fx/leaseTestUserFx";

export namespace createUsersFx {
	export type Props = {};
}

export const createUsersFx = Effect.fn("createUsersFx")(function* (_: createUsersFx.Props) {
	return {
		seller: yield* leaseTestUserFx({}),
		buyer: yield* leaseTestUserFx({}),
		stranger: yield* leaseTestUserFx({}),
	} as const;
});
