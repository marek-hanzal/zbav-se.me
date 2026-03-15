import type { MarkSuspense } from "@use-pico/client/type";
import { VisibleContainer } from "@use-pico/client/ui/container";
import { Suspense, type FC, useCallback } from "react";
import { Item } from "./Item";

export namespace Content {
	export interface Props extends MarkSuspense.Props {
		listingIds: string[];
	}
}

export const Content: FC<Content.Props> = ({ _suspense, listingIds }) => {
	const placeholder = useCallback(() => <Item.Fallback />, []);

	return (
		<>
			{listingIds.map((listingId) => {
				return (
					<VisibleContainer
						key={listingId}
						id={listingId}
						placeholder={placeholder}
					>
						<Suspense fallback={<Item.Fallback />}>
							<Item
								_suspense={"I know"}
								listingId={listingId}
							/>
						</Suspense>
					</VisibleContainer>
				);
			})}
		</>
	);
};
