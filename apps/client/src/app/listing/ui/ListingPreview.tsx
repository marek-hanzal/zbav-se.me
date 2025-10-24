import { Badge, Container, Icon, PriceInline, Tx } from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common";
import type { Gallery, ListingDto } from "@zbav-se.me/sdk";
import { type FC, memo } from "react";
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
						snapTo={"top-left"}
						round={"md"}
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
						size={"lg"}
						snapTo={"top-right"}
						round={"full"}
						tweak={{
							slot: {
								root: {
									class: [
										"p-2",
										"opacity-75",
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
							snapTo={"bottom-left"}
							round={"md"}
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
							round={"md"}
							snapTo={"bottom-right"}
							tweak={{
								slot: {
									root: {
										class: [
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

				{/* <BottomContainer>
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
				</BottomContainer> */}
			</Container>
		);
	},
);
