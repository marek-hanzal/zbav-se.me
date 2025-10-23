import {
	ArrowLeftIcon,
	Badge,
	Container,
	LinkTo,
	PriceInline,
	Tx,
} from "@use-pico/client";
import type { Gallery, ListingDto } from "@zbav-se.me/sdk";
import { type FC, memo } from "react";
import { BottomContainer } from "~/app/ui/container/BottomContainer";
import { StarIcon } from "~/app/ui/icon/StarIcon";
import { HeroImage } from "~/app/ui/img/HeroImage";
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
				{/* <Title
					textTitle={toHumanNumber({
						number: listing.price,
						locale,
						minimumFractionDigits: 2,
						maximumFractionDigits: 2,
						trailingZeroDisplay: "stripIfInteger",
					})}
					// textSubtitle={`${listing.category.name} / ${listing.categoryGroup.name}`}
					right={toTimeDiff({
						time: listing.createdAt,
					})}
				/> */}

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
						<PriceInline
							value={{
								price: listing.price,
							}}
							locale={locale}
							currency={"czk"}
						/>
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
									],
								},
							},
						}}
					>
						<TypoIcon
							icon={StarIcon}
							iconProps={{
								tone: "secondary",
								theme: "dark",
							}}
						>
							{listing.condition}
						</TypoIcon>
					</Badge>
				</Container>

				<BottomContainer>
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/app/dashboard"}
						params={{
							locale,
						}}
					>
						<Tx label={"dashboard"} />
					</LinkTo>
				</BottomContainer>
			</Container>
		);
	},
);
