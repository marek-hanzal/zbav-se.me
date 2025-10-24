import {
	Action,
	ArrowLeftIcon,
	Badge,
	Container,
	Icon,
	LinkTo,
	PriceInline,
	Tx,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common";
import type { Gallery, ListingDto } from "@zbav-se.me/sdk";
import { type FC, memo } from "react";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { BagIcon } from "~/app/ui/icon/BagIcon";
import { ExpireIcon } from "~/app/ui/icon/ExpireIcon";
import { HeroImage } from "~/app/ui/img/HeroImage";
import { RatingToIcon } from "~/app/ui/rating/RatingToIcon";
import { ThemeCls } from "~/app/ui/ThemeCls";
import { TypoIcon } from "~/app/ui/text/TypoIcon";

export namespace ListingPreview {
	export interface Props {
		listing: ListingDto;
		locale: string;
	}
}

export const ListingPreview: FC<ListingPreview.Props> = memo(
	({ locale, listing }) => {
		const [hero] = listing.gallery as [
			Gallery,
			...Gallery[],
		];

		return (
			<Container layout={"vertical-content-footer"}>
				<Container
					tone={"primary"}
					theme={"light"}
					border={"default"}
					shadow={"default"}
					position={"relative"}
					round={"xl"}
				>
					<HeroImage
						src={hero.url}
						alt={`Hero image for listing ${listing.id}`}
						className={"w-full h-full object-cover rounded-xl"}
					/>

					<Badge
						tone={"secondary"}
						theme={"dark"}
						size={"lg"}
						tweak={{
							slot: {
								root: {
									class: [
										"absolute",
										"top-2",
										"left-2",
									],
								},
							},
						}}
					>
						{listing.price > 0 ? (
							<PriceInline
								price={listing.price}
								locale={locale}
								currency={listing.currency}
							/>
						) : (
							<Tx label={"Price - free"} />
						)}
					</Badge>

					<Badge
						tone={"secondary"}
						theme={"dark"}
						size={"lg"}
						tweak={{
							slot: {
								root: {
									class: [
										"absolute",
										"top-2",
										"right-2",
										"p-2",
									],
								},
							},
						}}
					>
						<Icon
							icon={
								RatingToIcon[
									listing.condition as RatingToIcon.Value
								]
							}
						/>
					</Badge>

					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "light",
						}}
					>
						<Badge
							size={"lg"}
							tweak={{
								slot: {
									root: {
										class: [
											"absolute",
											"bottom-2",
											"left-2",
										],
									},
								},
							}}
						>
							<TypoIcon
								icon={ExpireIcon}
								iconProps={{
									size: "xs",
								}}
							>
								{toTimeDiff({
									time: listing.expiresAt,
								})}
							</TypoIcon>
						</Badge>
					</VariantProvider>

					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "light",
						}}
					>
						<Badge
							size={"lg"}
							tweak={{
								slot: {
									root: {
										class: [
											"absolute",
											"bottom-2",
											"right-2",
											"min-w-0",
											"max-w-1/2",
										],
									},
								},
							}}
						>
							<TypoIcon
								icon={ExpireIcon}
								iconProps={{
									size: "xs",
								}}
								tweak={{
									slot: {
										root: {
											class: [
												"min-w-0",
											],
										},
										content: {
											class: [
												"truncate",
												"max-w-full",
											],
										},
									},
								}}
							>
								{listing.location.address}
							</TypoIcon>
						</Badge>
					</VariantProvider>
				</Container>

				<BottomContainer>
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/app/dashboard"}
						params={{
							locale,
						}}
					/>

					<Action
						iconEnabled={BagIcon}
						tweak={{
							slot: {
								root: {
									class: [
										"bg-none",
									],
								},
							},
						}}
					/>
				</BottomContainer>
			</Container>
		);
	},
);
