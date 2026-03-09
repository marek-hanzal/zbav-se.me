import { useLocale } from "@use-pico/client/hook";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo, type uiLinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { withListingQuery } from "@zbav-se.me/sdk/query/buyer/listing";
import { SearchIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";

export namespace Data {
	export interface Props extends uiLinkTo.Component<{}>, MarkSuspense.Props {
		feedId: string;
	}
}

export const Data: FC<Data.Props> = ({ _suspense, feedId, ui, className, ...props }) => {
	const locale = useLocale();
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);
	const { data: listingCount } = withListingQuery.useCountQuery(feed.query);

	const hasListings = listingCount.filter > 0;

	return (
		<LinkTo
			data-ui={"SearchButton[LinkTo]"}
			to="/$locale/buyer/feed/$id/list"
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
};
