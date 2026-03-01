import type { MarkSuspense } from "@use-pico/client/type";
import type { FC } from "react";
import { CreateButton } from "~/app/@seller-user/draft/ui/button/CreateButton";
import { ListingItem } from "./ListingItem";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		listingIds: string[];
	}
}

export const Content: FC<Content.Props> = ({ _suspense, listingIds }) => {
	return (
		<>
			{listingIds.map((listingId) => {
				return (
					<ListingItem
						key={listingId}
						listingId={listingId}
					/>
				);
			})}

			<CreateButton
				ui={{
					height: "full",
					width: "full",
				}}
			/>
		</>
	);
};
