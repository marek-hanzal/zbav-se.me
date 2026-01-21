import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, useState } from "react";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";
import { ListingSheet } from "~/app/listing/ui/ListingSheet";

export namespace TransactionListingItem {
	export interface Props extends Container.Props {
		listingId: string;
	}
}

export const TransactionListingItem: FC<TransactionListingItem.Props> = ({
	listingId,
	ui,
	className,
	...props
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<withListingFetchQuery.Suspense
			data={{
				where: {
					id: listingId,
				},
			}}
			fallback={
				<SpinnerContainer
					type={"icon"}
					ui={{
						tone: "neutral",
						theme: "light",
						background: "default",
						border: true,
						shadow: true,
						round: "default",
					}}
					className={[
						"h-48 md:h-92",
					]}
					onClick={() => setIsOpen((prev) => !prev)}
				/>
			}
		>
			{({ data: listing }) => {
				// biome-ignore lint/correctness/useHookAtTopLevel: Ssst
				const hero = useHeroUpload(listing.gallery.items);

				return (
					<>
						<Container
							ui={{
								position: "relative",
								round: "default",
								...ui,
							}}
							className={[
								"h-48 md:h-92",
								className,
							]}
							onClick={() => setIsOpen((prev) => !prev)}
							{...props}
						>
							<HeroImage
								src={hero.url}
								alt={`Hero image for listing ${listing.id}`}
								ui={{
									round: "default",
								}}
							/>

							<Container
								ui={{
									tone: "secondary",
									theme: "light",
									color: "lead",
									flow: "vertical",
									background: "default",
									border: true,
									shadow: true,
									inner: "default",
									round: "default",
									snapTo: "bottom",
								}}
								className={"text-center"}
							>
								<Tx
									label={listing.title}
									ui={{
										font: "bold",
									}}
								/>

								<Tx
									label={listing.location.address}
									ui={{
										text: "sm",
									}}
								/>
							</Container>
						</Container>

						<ListingSheet
							listing={listing}
							data-id={listingId}
							state={{
								value: isOpen,
								set: setIsOpen,
							}}
							withScore={false}
							feedId={undefined}
							tools={[
								"hero",
							]}
						/>
					</>
				);
			}}
		</withListingFetchQuery.Suspense>
	);
};
