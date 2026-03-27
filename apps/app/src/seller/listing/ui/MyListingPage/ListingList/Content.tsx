import type { MarkSuspense } from "@use-pico/client/type";
import { type FC, Suspense, useCallback } from "react";
import { VisibleContainer } from "@/lib/client/visibility";
import { CreateButton } from "~/seller/draft/~public/CreateButton";
import { ListingItem } from "./ListingItem";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		listingIds: string[];
	}
}

export const Content: FC<Content.Props> = ({ _suspense, listingIds }) => {
	const placeholder = useCallback(() => {
		return <ListingItem.Fallback />;
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
						<Suspense fallback={<ListingItem.Fallback />}>
							<ListingItem listingId={listingId} />
						</Suspense>
					</VisibleContainer>
				);
			})}

			<CreateButton />
		</>
	);
};
