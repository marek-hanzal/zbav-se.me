import type { MarkSuspense } from "@use-pico/client/type";
import { VisibleContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { CreateButton } from "~/app/@seller-user/draft/ui/button/CreateButton";
import { Pending } from "./ListingItem/Pending";
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
					<VisibleContainer
						key={listingId}
						id={listingId}
						placeholder={() => <Pending />}
					>
						<ListingItem
							key={listingId}
							listingId={listingId}
						/>
					</VisibleContainer>
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
