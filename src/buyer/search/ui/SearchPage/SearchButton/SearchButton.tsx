import { Badge } from "@/lib/client/badge";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { LinkTo, type uiLinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { toLocaleNumber } from "@/lib/common/to-locale-number";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { SearchIcon } from "~/common/ui/icon";

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
					"data-ui-tone": "primary",
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
					data-ui-tone="primary"
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
					"data-ui-tone": "primary",
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
					data-ui={"SearchButton-[Container.content.pending]"}
					data-ui-flow="horizontal"
					data-ui-items="center"
					data-ui-gap="default"
					data-ui-justify="space-between"
					data-ui-width="full"
				>
					<Tx
						label="Search (button)"
						data-ui-tone="primary"
						data-ui-theme="light"
						data-ui-color="lead"
						data-ui-text="xl"
					/>

					<Tx
						label="Loading... (label)"
						data-ui-tone="neutral"
						data-ui-theme="light"
						data-ui-color="lead"
						data-ui-text="xs"
						data-ui-opacity="6"
					/>
				</Container>
			</LinkTo>
		);
	},
);
