import type { MarkSuspense } from "@use-pico/client/type";
import { VisibleContainer } from "@use-pico/client/ui/container";
import type { FC } from "react";
import { Item } from "./Item";
import { Pending } from "./Item/Pending";

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
						<Item listingId={listingId} />
					</VisibleContainer>
				);
			})}
		</>
	);
};
