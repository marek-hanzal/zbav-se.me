import { useLocale } from "@use-pico/client/hook";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";

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
	const locale = useLocale();

	return (
		<Container
			data-ui={"TransactionListingItem[Container]"}
			data-id={listingId}
			className={tvc([
				"h-48 md:h-92",
				className,
			])}
			ui={{
				tone: "secondary",
				position: "relative",
				round: "lg",
				width: "full",
				shadow: true,
				...ui,
			}}
			{...props}
		>
			<LinkTo
				to={"/$locale/ui/seller/message/$listingId/list"}
				params={{
					locale,
					listingId,
				}}
				ui={{
					height: "full",
					width: "full",
				}}
			>
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
								width: "full",
								height: "full",
								shadow: true,
								round: "lg",
							}}
							className={[
								"h-48 md:h-92",
							]}
						/>
					}
				>
					{({ data: listing }) => {
						// biome-ignore lint/correctness/useHookAtTopLevel: Ssst
						const hero = useHeroUpload(listing.gallery.items);

						return (
							<>
								<HeroImage
									data-uri="TransactionListingItem-[HeroImage]"
									src={hero.url}
									alt={`Hero image for listing ${listing.id}`}
									visible
									invisible={
										<SpinnerContainer
											data-ui="TransactionListingItem-[SpinnerImage]"
											type={"icon"}
											ui={{
												tone: "neutral",
												theme: "light",
												background: "default",
												round: "lg",
											}}
											className={[
												"w-full",
												"h-full",
											]}
										/>
									}
									ui={{
										round: "lg",
										width: "full",
									}}
								/>

								<Container
									ui={{
										tone: "neutral",
										theme: "light",
										color: "lead",
										flow: "vertical",
										background: "default",
										border: true,
										shadow: true,
										inner: "default",
										round: "md",
										snapTo: "bottom",
									}}
									className={"text-center"}
								>
									<Tx
										label={listing.title}
										ui={{
											tone: "brand",
											theme: "light",
											color: "lead",
											font: "bold",
											truncate: true,
										}}
									/>

									<Tx
										label={listing.location.address}
										ui={{
											text: "sm",
										}}
									/>
								</Container>
							</>
						);
					}}
				</withListingFetchQuery.Suspense>
			</LinkTo>
		</Container>
	);
};
