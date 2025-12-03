import { Badge } from "@use-pico/client/ui/badge";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { ListingCountBadge } from "../listing/ListingCountBadge";
import { FeedSetupButton } from "./button/FeedSetupButton";

export namespace FeedItemBadge {
	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		feed: tFeed;
		defaultOpen: boolean;
	}
}

export const FeedItemBadge: FC<FeedItemBadge.Props> = ({ locale, feed, defaultOpen, ...props }) => {
	const [isFeedSettings, setIsFeedSettings] = useState(false);

	return (
		<Badge
			ui={"FeedItemBadge-root"}
			data-id={feed.id}
			tone={"primary"}
			className={[
				"relative",
				"h-fit",
				"p-0",
				"w-full",
				"contain-content",
			]}
			round={"md"}
			{...props}
		>
			<LinkTo
				to={"/$locale/buyer/listing/list"}
				params={{
					locale,
				}}
				search={{
					query: feed.query,
					feedId: feed.id,
				}}
				full
				tweak={{
					slot: {
						root: {
							class: [
								"flex",
								"flex-col",
								"items-start",
								"gap-1",
								"w-full",
								"h-64",
							],
						},
					},
				}}
			>
				{feed.upload ? (
					<HeroImage
						src={feed.upload.url}
						alt={`Hero image for feed ${feed.id}`}
						visible
						round
						tweak={{
							slot: {
								img: {
									class: [
										"w-full",
									],
								},
							},
						}}
					/>
				) : null}
			</LinkTo>

			<Badge
				snapTo={"top"}
				round={"md"}
				tone={"secondary"}
				className={[
					"h-fit",
				]}
			>
				<Typo
					label={feed.name}
					font={"bold"}
					truncate
					tweak={{
						slot: {
							root: {
								class: [
									"pt-1",
									"px-2",
								],
							},
						},
					}}
				/>
			</Badge>

			<FeedSetupButton
				locale={locale}
				state={{
					value: isFeedSettings,
					set: setIsFeedSettings,
				}}
				iconEnabled={FeedIcon}
				tone={"secondary"}
				size={"md"}
				snapTo={"bottom-left"}
				feed={feed}
				defaultOpen={defaultOpen}
				noDelete={false}
			/>

			<ListingCountBadge
				locale={locale}
				query={feed.query}
				snapTo={"bottom-right"}
			/>
		</Badge>
	);
};
