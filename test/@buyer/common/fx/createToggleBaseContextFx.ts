import { Effect } from "effect";
import { createListingFx } from "~/test/listing/fx/createListingFx";
import type { testabaseFn } from "~/test/testabaseFn";
import { createUsersFx } from "~/test/user/fx/createUsersFx";

type TestDatabase = Awaited<ReturnType<typeof testabaseFn>>;
type TestListing = Effect.Success<ReturnType<typeof createListingFx>>;
type TestUsers = Effect.Success<ReturnType<typeof createUsersFx>>;

namespace createToggleBaseContextFx {
	export interface Props {
		database: TestDatabase;
		userSlug: string;
	}

	export interface Result {
		database: TestDatabase;
		listing: TestListing;
		users: TestUsers;
	}
}

export const createToggleBaseContextFx = ({ database }: createToggleBaseContextFx.Props) =>
	Effect.gen(function* () {
		const users = yield* createUsersFx({});
		const listing = yield* createListingFx(users.seller.id);

		return {
			database,
			listing,
			users,
		} satisfies createToggleBaseContextFx.Result;
	});
