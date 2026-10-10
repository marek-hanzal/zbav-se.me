import { SearchIcon } from "~/application-ui/constant/icon.exports";
import { withFeedQuery } from "~/buyer-feed/query/withFeedQuery";
import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import { useLocale } from "~/locale/hook/useLocale";
import { toLocaleNumber } from "~/number/fn/toLocaleNumber";
import { Tx } from "~/translation/ui/Tx";
import type { uiLinkTo } from "~/ui/fn/uiLinkTo";
import { withFallback } from "~/ui/fn/withFallback";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Badge } from "~/ui/ui/Badge";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";

export namespace SearchButton {
	export interface Props extends uiLinkTo.Component<{}>, MarkSuspense.Props {
		feedId: string;
	}
}

export const SearchButton = withFallback(
	({ _suspense, feedId, className, ...props }: SearchButton.Props) => {
		const locale = useLocale();
		const { data: feed } = withFeedQuery.useFetchQuery(feedId);
		const { data: listingCount } = withListingQuery.useCountQuery(feed.query);

		const hasListings = listingCount > 0;

		return (
			<LinkTo
				data-ui={"SearchButton[LinkTo]"}
				to="/$locale/app/buyer/feed/$id/list"
				params={{
					locale,
					id: feedId,
				}}
				icon={SearchIcon}
				iconProps={{
					"data-ui-tone": hasListings ? "primary" : "neutral",
					"data-ui-theme": "light",
					"data-ui-color": "lead",
					"data-ui-text": "xl",
				}}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-size="default"
				data-ui-justify="start"
				data-ui-items="center"
				data-ui-background="default"
				data-ui-round={undefined}
				data-ui-shadow={false}
				data-ui-border={false}
				data-ui-width="full"
				className={className}
				{...props}
			>
				<Container
					data-ui-flow="horizontal"
					data-ui-items="center"
					data-ui-justify="space-between"
					data-ui-tone={hasListings ? "primary" : "neutral"}
					data-ui-theme="light"
					data-ui-color="lead"
					data-ui-width="full"
				>
					<Tx
						label={"Search (button)"}
						data-ui-text="lg"
						data-ui-font="bold"
					/>

					{hasListings ? (
						<Badge
							data-ui-tone="secondary"
							data-ui-theme="light"
							data-ui-color="text"
							data-ui-badge="xs"
						>
							{listingCount > 9
								? "9+"
								: toLocaleNumber({
										number: listingCount,
										locale,
									})}
						</Badge>
					) : (
						<Tx
							label={"Search - empty (label)"}
							data-ui-text="sm"
						/>
					)}
				</Container>
			</LinkTo>
		);
	},
	({ feedId, className, ...props }: Omit<SearchButton.Props, "_suspense">) => {
		const locale = useLocale();

		return (
			<LinkTo
				data-ui={"SearchButton[LinkTo.pending]"}
				to="/$locale/app/buyer/feed/$id/list"
				params={{
					locale,
					id: feedId,
				}}
				icon={SearchIcon}
				iconProps={{
					"data-ui-tone": "neutral",
					"data-ui-theme": "light",
					"data-ui-color": "lead",
					"data-ui-text": "xl",
				}}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-size="default"
				data-ui-justify="center"
				data-ui-items="center"
				data-ui-background="default"
				data-ui-round={undefined}
				data-ui-shadow={false}
				data-ui-border={false}
				data-ui-width="full"
				className={className}
				{...props}
			>
				<Container
					data-ui-flow="horizontal"
					data-ui-items="center"
					data-ui-gap="default"
					data-ui-justify="space-between"
					data-ui-width="full"
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-color="lead"
				>
					<Tx
						label="Search (button)"
						data-ui-text="lg"
						data-ui-font="bold"
					/>

					<Tx
						label="Loading... (label)"
						data-ui-text="xs"
						data-ui-opacity="6"
					/>
				</Container>
			</LinkTo>
		);
	},
);
