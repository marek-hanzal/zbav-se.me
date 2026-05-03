import { type FC, useCallback } from "react";
import { VisibleContainer } from "@/lib/client/visibility";
import { ListItemPending } from "~/common/list-item/ListItemPending";
import type { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";
import { ListingItem } from "./ListingItem";

export namespace Content {
	export interface Props {
		collection: ListingSchema.Type[];
	}
}

export const Content: FC<Content.Props> = ({ collection }) => {
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
			"CreateButton"
		</>
	);
};
