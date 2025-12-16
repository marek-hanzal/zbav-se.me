import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import type { FC } from "react";
import type { Item } from "~/app/feed/ui/list/Item";
import { Content } from "./list/Content";

export namespace List {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		limit?: number;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const List: FC<List.Props> = ({ locale, query, limit = 10, tools, linkTo, ...props }) => {
	return (
		<withFeedCountQuery.Suspense
			data={{}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				const isLimitReached = data.filter >= limit;

				return (
					<Container
						data-ui={"FeedListContainer[Container]"}
						ui={{
							layout: "vertical-flex",
							scroll: "vertical",
							gap: "default",
							inner: "default",
							height: "full",
						}}
						{...props}
					>
						<Content
							_suspense={"I know"}
							locale={locale}
							query={query}
							tools={tools}
							linkTo={linkTo}
							isLimitReached={isLimitReached}
						/>
					</Container>
				);
			}}
		</withFeedCountQuery.Suspense>
	);
};
