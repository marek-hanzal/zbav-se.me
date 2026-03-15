import type { MarkSuspense } from "@use-pico/client/type";
import { VisibleContainer } from "@use-pico/client/ui/container";
import { type FC, useCallback } from "react";
import { CreateButton } from "~/app/@seller/draft/~public/CreateButton";
import { ListingItem } from "./ListingItem";
import { Pending } from "./ListingItem/Pending";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		listingIds: string[];
	}
}

export const Content: FC<Content.Props> = ({ _suspense, listingIds }) => {
	const placeholder = useCallback(() => {
		return <Pending />;
	}, []);

	return (
		<>
			{listingIds.map((listingId) => {
				return (
					<VisibleContainer
						key={listingId}
						id={listingId}
						placeholder={placeholder}
					>
						<ListingItem
							key={listingId}
							listingId={listingId}
						/>
					</VisibleContainer>
				);
			})}

			<CreateButton />
		</>
	);
};
