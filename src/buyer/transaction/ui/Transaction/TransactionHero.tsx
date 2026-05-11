import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { useRenderLogger } from "@/lib/client/log";
import type { MarkSuspense } from "@/lib/client/type";
import { withTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";
import type { ListingPriceSchema } from "~/common/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
import { LocationBadge } from "~/common/location/ui/LocationBadge";
import { getRootLogger } from "~/common/log/getRootLogger";
import { HeroImage } from "~/common/ui/img";
import { ListingSheet } from "./ListingSheet";

export namespace TransactionHero {
	export interface Props extends Container.Props, MarkSuspense.Props {
		transactionId: string;
	}
}

export const TransactionHero: FC<TransactionHero.Props> = ({
	_suspense,
	transactionId,
	...props
}) => {
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);
	const [detail, setDetail] = useState(false);
	const [hero] = transaction.withImageUrl;

	useRenderLogger({
		logger: getRootLogger(),
		name: "TransactionHero",
	});

	return (
		<Container
			data-ui={"TransactionHero"}
			data-action={"open transaction detail"}
			data-ui-position="relative"
			data-ui-height="content"
			onClick={() => setDetail((prev) => !prev)}
			{...props}
		>
			<HeroImage
				src={hero}
				alt={`Hero image for transaction ${transaction.id}`}
				className={"h-42"}
			/>

			<ListingPrice
				price={transaction as ListingPriceSchema.Type}
				data-ui-snap-to="top-center"
				data-ui-opacity="8"
				data-ui-z-index
			/>

			<LocationBadge
				location={transaction.location}
				distance={null}
				data-ui-snap-to="bottom"
				data-ui-opacity="8"
				data-ui-z-index
			/>

			<ListingSheet
				_suspense={_suspense}
				listingId={transaction.listingId}
				state={{
					value: detail,
					set: setDetail,
				}}
			/>
		</Container>
	);
};
