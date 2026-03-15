import type { Container } from "@use-pico/client/ui/container";
import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace ListingList {
	export interface Props extends Container.Props {
		//
	}
}

/**
 * Builds the seller listing scroll container, wires visibility tracking, and loads data via suspense.
 * Use it as the main list body for seller listings when visibility-aware rendering is required.
 *
 * @see apps/app/src/app//listing/page/MyListingPage.tsx
 */
export const ListingList: FC<ListingList.Props> = (props) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data {...props} />
		</Suspense>
	);
};
