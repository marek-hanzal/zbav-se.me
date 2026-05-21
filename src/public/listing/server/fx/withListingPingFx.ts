import { Effect } from "effect";
import { withListingSelectFx } from "../db/withListingSelectFx";

export namespace withListingPingFx {
	export interface Props {
		id: string;
	}
}

/**
 * Helper to check if the listing literally exists, so if the "primary" source returns
 * resource not found, but this method tells "true" it means user does not have an access
 * to the listinng.
 *
 * Original usecase is to render proper UI so user knows, what's wrong.
 */
export const withListingPingFx = Effect.fn("withListingPingFx")(function* ({
	id,
}: withListingPingFx.Props) {
	const { select } = yield* withListingSelectFx({
		hasExplicitCategory: true,
	});
	return !!select.clearWhere().where("l.id", "=", id).executeTakeFirst();
});

export type withListingPingFx = ReturnType<typeof withListingPingFx>;
