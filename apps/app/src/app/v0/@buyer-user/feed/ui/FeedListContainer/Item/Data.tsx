import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import type { FC } from "react";
import { View } from "./View";

export namespace Data {
	export interface Props {
		feedId: string;
		tools: View.Tools[];
		linkTo: View.LinkTo;
	}
}

export const Data: FC<Data.Props> = ({ feedId, tools, linkTo }) => {
	const feedQuery = withFeedQuery.useFetchQuery(feedId);

	return (
		<View
			feed={feedQuery.data}
			tools={tools}
			linkTo={linkTo}
		/>
	);
};
