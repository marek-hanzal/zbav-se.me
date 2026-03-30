import { type FC, Suspense, useCallback } from "react";
import type { MarkSuspense } from "@/lib/client/type";
import { VisibleContainer } from "@/lib/client/visibility";
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
