import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace FeedList {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

/**
 * Suspense boundary for buyer feed preset listing used on feed selection screens.
 *
 * The component intentionally does not render list details itself:
 * - `Data` loads feed ids with query + limit pagination setup
 * - `Data` also resolves total count and enables/disables the create action at the limit
 * - `Pending` is shown while the list query is suspended
 *
 * Use this as the top-level list block in pages that allow selecting or creating feeds.
 */
export const FeedList: FC<FeedList.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
