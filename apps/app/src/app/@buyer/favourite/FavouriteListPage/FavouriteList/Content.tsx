import type { MarkSuspense } from "@use-pico/client/type";
import { VisibleContainer } from "@use-pico/client/ui/container";
import { type FC, useCallback } from "react";
import { Item } from "./Item";
import { Pending } from "./Item/Pending";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		listingIds: string[];
	}
}

export const Content: FC<Content.Props> = ({ _suspense, listingIds }) => {
	const placeholder = useCallback(() => <Pending />, []);

	return (
		<>
			{listingIds.map((listingId) => {
				return (
					<VisibleContainer
						key={listingId}
						id={listingId}
						placeholder={placeholder}
					>
						<Item listingId={listingId} />
					</VisibleContainer>
				);
			})}
		</>
	);
};
