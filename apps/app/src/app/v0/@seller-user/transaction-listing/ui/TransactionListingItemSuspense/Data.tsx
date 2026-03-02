import { useLocale } from "@use-pico/client/hook";
import { Icon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Badge } from "@use-pico/client/ui/badge";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import { toLocaleNumber } from "@use-pico/common/to-locale-number";
import { withTransactionListingQuery } from "@zbav-se.me/sdk/query/seller-user/transaction-listing";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import type { FC } from "react";
import { useUpload } from "~/app/@common/gallery/hook/useUpload";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionListingId: string;
	}
}

export const Data: FC<Data.Props> = ({
	_suspense,
	transactionListingId,
	ui,
	className,
	...props
}) => {
	const locale = useLocale();
	const { data: transactionListing } =
		withTransactionListingQuery.useFetchQuery(transactionListingId);
	const hero = useUpload(transactionListing.gallery.items);

	return (
		<Container
			data-ui={"TransactionListingItem[Container]"}
			data-id={transactionListing.id}
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
				to={"/$locale/seller/message/$listingId/list"}
				params={{
					locale,
					listingId: transactionListing.id,
				}}
				ui={{
					height: "full",
					width: "full",
				}}
			>
				<HeroImage
					data-ui="TransactionListingItem-[HeroImage]"
					src={hero.url}
					alt={`Hero image for listing ${transactionListing.id}`}
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
						label={transactionListing.title}
						ui={{
							tone: "brand",
							theme: "light",
							color: "lead",
							font: "bold",
							truncate: true,
						}}
					/>
				</Container>
			</LinkTo>
		</Container>
	);
};
