import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo, type uiLinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { withFallback } from "@use-pico/client/utils";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { SearchIcon } from "@zbav-se.me/ui/icon";

export namespace SearchButton {
	export interface Props extends uiLinkTo.Component<{}>, MarkSuspense.Props {
		feedId: string;
	}
}

export const SearchButton = withFallback(
	({ _suspense, feedId, ui, className, ...props }: SearchButton.Props) => {
		const locale = useLocale();
		const { data: feed } = withFeedQuery.useFetchQuery(feedId);
		const { data: listingCount } = withListingQuery.useCountQuery(feed.query);

		const hasListings = listingCount.filter > 0;

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
					ui: {
						tone: "primary",
						theme: "light",
						color: "lead",
						text: "xl",
					},
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
							{listingCount.filter > 9
								? "9+"
								: toLocaleNumber({
										number: listingCount.filter,
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
	({ feedId, ui, className, ...props }: Omit<SearchButton.Props, "_suspense">) => {
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
					ui: {
						tone: "primary",
						theme: "light",
						color: "lead",
						text: "xl",
					},
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
