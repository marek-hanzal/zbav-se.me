import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace FeedListContainer {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

/**
 * Coordinates feed list loading through suspense and delegates resolved rendering to the data component.
 * Use it when feed collections are fetched asynchronously and should keep a dedicated pending state.
 *
 * @see apps/app/src/app/@buyer-user/feed/page/FeedSelectPage.tsx
 */
export const FeedListContainer: FC<FeedListContainer.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				{...props}
			/>
		</Suspense>
	);
};
