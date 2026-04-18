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
				ui={{
					tone: "neutral",
					theme: "light",
					size: "default",
					justify: "start",
					items: "center",
					background: "default",
					round: undefined,
					shadow: false,
					border: false,
					width: "full",
					...ui,
				}}
				className={className}
				{...props}
			>
				<Container
					ui={{
						flow: "horizontal",
						items: "center",
						justify: "space-between",
						tone: "primary",
						theme: "light",
						color: "lead",
						width: "full",
					}}
				>
					<Tx
						label={"Search (button)"}
						ui={{
							text: "lg",
							font: "bold",
						}}
					/>

					{hasListings ? (
						<Badge
							ui={{
								tone: "secondary",
								theme: "light",
								color: "text",
								badge: "xs",
							}}
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
							ui={{
								text: "sm",
							}}
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
				ui={{
					tone: "neutral",
					theme: "light",
					size: "default",
					justify: "center",
					items: "center",
					background: "default",
					round: undefined,
					shadow: false,
					border: false,
					width: "full",
					...ui,
				}}
				className={className}
				{...props}
			>
				<Container
					data-ui={"SearchButton-[Container.content.pending]"}
					ui={{
						flow: "horizontal",
						items: "center",
						gap: "default",
						justify: "space-between",
						width: "full",
					}}
				>
					<Tx
						label="Search (button)"
						ui={{
							tone: "primary",
							theme: "light",
							color: "lead",
							text: "xl",
						}}
					/>

					<Tx
						label="Loading... (label)"
						ui={{
							tone: "neutral",
							theme: "light",
							color: "lead",
							text: "xs",
							opacity: "6",
						}}
					/>
				</Container>
			</LinkTo>
		);
	},
);
