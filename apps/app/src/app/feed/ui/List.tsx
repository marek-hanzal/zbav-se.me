import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useState } from "react";
import type { Item } from "~/app/feed/ui/list/Item";
import { CreateButton } from "./button/CreateButton";
import { Content } from "./list/Content";

export namespace List {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		limit?: number;
		scrollToId: string | undefined;
		tools: Item.Tools[];
		linkTo: Item.LinkTo;
	}
}

export const List: FC<List.Props> = ({
	locale,
	query,
	limit = 10,
	scrollToId,
	tools,
	linkTo,
	...props
}) => {
	/**
	 * We're keeping locale state just for "after creation" open state
	 */
	const [defaultOpenId, setDefaultOpenId] = useState<string | undefined>(undefined);

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
							layout: isLimitReached ? "vertical" : "vertical-content-footer",
							gap: "md",
							inner: "default",
						}}
						{...props}
					>
						<Content
							_suspense={"I know"}
							locale={locale}
							query={query}
							defaultOpenId={defaultOpenId}
							scrollToId={scrollToId}
							tools={tools}
							linkTo={linkTo}
						/>

						{data.filter > 0 ? (
							<CreateButton
								disabled={isLimitReached}
								onCreate={(data) => {
									setDefaultOpenId(data.id);
								}}
							/>
						) : null}
					</Container>
				);
			}}
		</withFeedCountQuery.Suspense>
	);
};
