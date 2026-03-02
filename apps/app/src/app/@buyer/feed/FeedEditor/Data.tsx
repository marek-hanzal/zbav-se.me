import type { MarkSuspense } from "@use-pico/client/type";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import type { FC } from "react";

export namespace Data {
	export interface Props extends MarkSuspense.Props {
		feedId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, feedId }) => {
	const feed = withFeedQuery.useFetchQuery(feedId);

	return "foo";
};
