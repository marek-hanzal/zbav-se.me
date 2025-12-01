import { Badge } from "@use-pico/client/ui/badge";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { ListingCountBadge } from "../listing/ListingCountBadge";
import { FeedDetailContainer } from "./FeedDetailContainer";

export namespace FeedItemBadge {
	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		feed: tFeed;
		defaultOpen: boolean;
	}
}

export const FeedItemBadge: FC<FeedItemBadge.Props> = ({ locale, feed, defaultOpen, ...props }) => {
	const [isOpen, setIsOpen] = useState(defaultOpen);

	if (feed.upload) {
		return (
			<Badge
				className={[
					"relative",
					"h-fit",
					"p-0",
					"w-full",
				]}
				round={"md"}
			>
				<LinkTo
					to={"/$locale/buyer/listing/list"}
					params={{
						locale,
					}}
					search={{
						query: feed.query,
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
								],
							},
						},
					}}
				>
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
										"h-64",
									],
								},
							},
						}}
					/>
				</LinkTo>

				<Badge
					snapTo={"top"}
					round={"md"}
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

				<Button
					iconEnabled={FeedIcon}
					tone={"secondary"}
					label={"Feed setup (label)"}
					size={"md"}
					snapTo={"bottom-left"}
					onClick={() => setIsOpen(true)}
				/>

				<ListingCountBadge
					locale={locale}
					query={feed.query}
					snapTo={"bottom-right"}
				/>

				<BottomSheet
					isOpen={isOpen}
					onClose={() => setIsOpen(false)}
					detent={"full"}
				>
					<FeedDetailContainer
						locale={locale}
						feed={feed}
						tweak={{
							slot: {
								root: {
									class: [
										"pt-14",
									],
								},
							},
						}}
					/>
				</BottomSheet>
			</Badge>
		);
	}

	return (
		<>
			<Badge
				tone={"primary"}
				round={"default"}
				tweak={{
					slot: {
						root: {
							class: [
								"flex-col",
								"gap-2",
								"w-full",
								"h-fit",
								"items-start",
								"p-0",
							],
						},
					},
				}}
				{...props}
			>
				<LinkTo
					to={"/$locale/buyer/listing/list"}
					params={{
						locale,
					}}
					search={{
						query: feed.query,
					}}
					full
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
				</LinkTo>

				<div className={"flex flex-row gap-2 items-center justify-between w-full p-2"}>
					<Button
						iconEnabled={FeedIcon}
						tone={"secondary"}
						label={"Feed setup (label)"}
						size={"md"}
						onClick={() => setIsOpen(true)}
					/>

					<ListingCountBadge
						locale={locale}
						query={feed.query}
					/>
				</div>
			</Badge>

			<BottomSheet
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				detent={"full"}
			>
				<FeedDetailContainer
					locale={locale}
					feed={feed}
					tweak={{
						slot: {
							root: {
								class: [
									"pt-14",
								],
							},
						},
					}}
				/>
			</BottomSheet>
		</>
	);
};
