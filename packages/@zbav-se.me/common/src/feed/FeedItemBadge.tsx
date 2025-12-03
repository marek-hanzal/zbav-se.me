import { Badge } from "@use-pico/client/ui/badge";
import { Typo } from "@use-pico/client/ui/typo";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type PropsWithChildren, type ReactNode, useState } from "react";
import { ListingCountBadge } from "../listing/ListingCountBadge";
import { FeedSetupButton } from "./button/FeedSetupButton";

export namespace FeedItemBadge {
	export namespace LinkTo {
		export interface Props extends PropsWithChildren {
			feed: tFeed;
		}

		export type RenderFn = (props: Props) => ReactNode;
	}

	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		feed: tFeed;
		defaultOpen: boolean;
		linkTo: LinkTo.RenderFn;
	}
}

export const FeedItemBadge: FC<FeedItemBadge.Props> = ({
	locale,
	feed,
	defaultOpen,
	linkTo,
	...props
}) => {
	const [isFeedSettings, setIsFeedSettings] = useState(false);

	return (
		<Badge
			ui={"FeedItemBadge-root"}
			data-id={feed.id}
			tone={"primary"}
			className={[
				"relative",
				"p-0",
				"w-full",
				"h-48",
				"contain-content",
			]}
			round={"md"}
			{...props}
		>
			{feed.upload
				? linkTo({
						feed,
						children: (
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
						),
					})
				: null}

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
