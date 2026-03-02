import type { FC } from "react";
import { Item } from "~/app/@buyer-user/feed/ui/FeedList/Item";

export namespace Data {
	export interface Props {
		feedId: string;
	}
}

export const Data: FC<Data.Props> = ({ feedId }) => {
	return <Item feedId={feedId} />;
};
