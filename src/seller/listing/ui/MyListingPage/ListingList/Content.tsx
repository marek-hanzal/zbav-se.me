import { type FC, useCallback } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { VisibleContainer } from "@/lib/client/visibility";
import { ListItemPending } from "~/common/list-item/ListItemPending";
import { CreateButton } from "~/seller/draft/ui/DraftListPage/DraftList/CreateButton";
import type { ListingSchema } from "~/seller/listing/server/schema/ListingSchema";
import { ListingItem } from "./ListingItem";

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
