import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { withTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";
import { useUpload } from "~/common/gallery/hook/useUpload";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { LocationBadge } from "~/common/location/ui/LocationBadge";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";

export namespace TransactionHero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionId: string;
	}
}

export const TransactionHero: FC<TransactionHero.Props> = ({ transactionId, ...props }) => {
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);
	const [, setDetail] = useState(false);
	const hero = useUpload(transaction.gallery.items);

	useRenderLogger({
		logger: getRootLogger(),
		name: "TransactionHero",
	});

	return (
		<Container
			data-ui={"TransactionHero"}
			data-action={"open transaction detail"}
			ui={{
				position: "relative",
				height: "content",
				...ui,
			}}
			onClick={() => setDetail((prev) => !prev)}
			{...props}
		>
			<HeroImage
				src={hero.url}
				alt={`Hero image for transaction ${transaction.id}`}
				className={"h-42"}
			/>

			<ListingPrice
				price={transaction.price}
				priceType={transaction.priceType}
				currency={transaction.currency}
				ui={{
					snapTo: "top-center",
					opacity: "8",
					zIndex: true,
				}}
			/>

			<LocationBadge
				location={transaction.location}
				distance={null}
				ui={{
					snapTo: "bottom",
					opacity: "8",
					zIndex: true,
				}}
			/>
		</Container>
	);
};
