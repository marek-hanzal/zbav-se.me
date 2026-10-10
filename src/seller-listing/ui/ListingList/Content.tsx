import { type FC, useCallback } from "react";
import { ListItemPending } from "~/list-item/ui/ListItemPending";
import { CreateButton } from "~/seller-draft/ui/DraftList/CreateButton";
import type { ListingSchema } from "~/seller-listing/schema/ListingSchema";
import { ListingItem } from "~/seller-listing/ui/ListingList/ListingItem.exports";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { VisibleContainer } from "~/visibility/ui/VisibleContainer";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		collection: ListingSchema.Type[];
	}
}

export const Content: FC<Content.Props> = ({ _suspense, collection }) => {
	const placeholder = useCallback(() => {
		return <ListItemPending />;
	}, []);

	return (
		<>
			{collection.map((listing) => {
				return (
					<VisibleContainer
						key={listing.id}
						id={listing.id}
						placeholder={placeholder}
					>
						<ListingItem listing={listing} />
					</VisibleContainer>
				);
			})}

			<CreateButton _suspense={_suspense} />
		</>
	);
};
