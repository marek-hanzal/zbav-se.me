import {
	Badge,
	Container,
	Icon,
	PriceInline,
	Tx,
	Typo,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import type { Gallery, ListingDto } from "@zbav-se.me/sdk";
import { type FC, memo } from "react";
import { HeroImage } from "~/app/ui/img/HeroImage";
import { RatingToIcon } from "~/app/ui/rating/RatingToIcon";
import { ThemeCls } from "~/app/ui/ThemeCls";

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
						tweak={{
							slot: {
								root: {
									class: [
										"border-none",
										"shadow-none",
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

					{/* <VariantProvider
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
					</VariantProvider> */}

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
							snapTo={"bottom"}
							tweak={{
								slot: {
									root: {
										class: [
											"opacity-85",
											"overflow-hidden",
										],
									},
								},
							}}
						>
							<Typo
								truncate
								label={listing.location.address}
							/>
						</Badge>
					</VariantProvider>
				</Container>
			</Container>
		);
	},
);
