import { type FC, Suspense } from "react";
import { Data } from "./Data";
import { Pending } from "./Pending";

export namespace FeedListContainer {
	export interface Props extends Omit<Data.Props, "_suspense"> {
		//
	}
}

export const FeedListContainer: FC<FeedListContainer.Props> = ({
	query,
	limit = 10,
	tools,
	linkTo,
	...props
}) => {
	return (
		<Suspense fallback={<Pending />}>
			<Data
				_suspense={"I know"}
				query={query}
				limit={limit}
				tools={tools}
				linkTo={linkTo}
				{...props}
			/>
		</Suspense>
	);
};
