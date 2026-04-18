import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { Overlay } from "@/lib/client/overlay";
import { SpinnerContainer } from "@/lib/client/spinner";
import type { MarkSuspense, StateType } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { HeroImage } from "~/common/ui/img";
import { Distance } from "./Distance";

export namespace Hero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		listingId: string;
		listingState: StateType.State<boolean>;
	}
}

export const Hero: FC<Hero.Props> = ({ listingId, listingState, ...props }) => {
	const locale = useLocale();
	const { data: listing } = withListingQuery.useFetchQuery(listingId);
	const hero = useUpload(listing.gallery.items);

	return (
		<Container
			data-id={listing.id}
			data-ui={"Item"}
			ui={{
				flow: "vertical",
				height: "full",
				width: "full",
				position: "relative",
			}}
			data-action={"open listing detail"}
			onClick={() => listingState.set((prev) => !prev)}
			{...props}
		>
			{listing.isIgnored ? (
				<Overlay
					ui={{
						type: "subtle",
					}}
				/>
			) : null}

			<Container
				ui={{
					height: "full",
				}}
			>
				<HeroImage
					src={hero.url}
					alt={`Hero image for listing ${listing.id}`}
					visible
					invisible={<SpinnerContainer />}
				/>
			</Container>

			<Container
				ui={{
					flow: "vertical",
					inner: "sm",
				}}
			>
				<Container
					ui={{
						flow: "horizontal",
						justify: "space-between",
						items: "center",
						gap: "default",
					}}
				>
					<Typo
						label={listing.title}
						ui={{
							tone: "brand",
							theme: "light",
							font: "bold",
							color: "lead",
							text: "sm",
						}}
					/>

					<Distance distance={listing.distance} />
				</Container>

				<ListingPrice
					price={listing.price}
					priceType={listing.priceType}
					currency={listing.currency}
					ui={{
						tone: "neutral",
						flow: "horizontal",
						background: undefined,
						shadow: false,
						border: false,
						opacity: "8",
					}}
				/>
			</Container>
		</Container>
	);
};
