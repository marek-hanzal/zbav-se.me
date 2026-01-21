import { useLocale } from "@use-pico/client/hook";
import { Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import type { tTransactionListing } from "@zbav-se.me/sdk/api/user";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query/user";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useHeroUpload } from "~/app/gallery/hook/useHeroUpload";

export namespace TransactionListingItem {
	export interface Props extends Container.Props {
		transactionListing: tTransactionListing;
	}
}

export const TransactionListingItem: FC<TransactionListingItem.Props> = ({
	transactionListing,
	ui,
	className,
	...props
}) => {
	const locale = useLocale();

	return (
		<Container
			data-ui={"TransactionListingItem[Container]"}
			data-id={transactionListing.listingId}
			className={tvc([
				"h-42 md:h-92",
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
					listingId: transactionListing.listingId,
				}}
				ui={{
					height: "full",
					width: "full",
				}}
			>
				<withListingFetchQuery.Suspense
					data={{
						where: {
							id: transactionListing.listingId,
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
								"h-42 md:h-92",
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

								<Badge
									ui={{
										tone: "neutral",
										theme: "light",
										flow: "horizontal",
										gap: "default",
										items: "center",
										justify: "center",
										inner: "default",
										snapTo: "top-left",
										size: undefined,
									}}
								>
									<Typo
										label={`x${toLocaleNumber({
											locale,
											number: transactionListing.count,
										})}`}
										ui={{
											font: "bold",
										}}
									/>

									<Icon
										icon={TransactionIcon}
										ui={{
											text: "lg",
										}}
									/>
								</Badge>

								<Badge
									ui={{
										tone: "neutral",
										theme: "light",
										inner: "default",
										snapTo: "top-right",
										size: undefined,
									}}
								>
									<Typo
										label={toTimeDiff({
											locale,
											time: transactionListing.lastAt,
										})}
										ui={{
											font: "bold",
										}}
									/>
								</Badge>

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
								</Container>
							</>
						);
					}}
				</withListingFetchQuery.Suspense>
			</LinkTo>
		</Container>
	);
};
