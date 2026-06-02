import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { Group } from "@/lib/client/group";
import { useRenderLogger } from "@/lib/client/log";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
import { LabelValue } from "@/lib/client/value";
import { withTransactionQuery } from "~/buyer/transaction/query/withTransactionQuery";
import type { ListingPriceSchema } from "~/common/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/common/listing/ui/ListingPrice";
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
	const translator = useTranslator();
	const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);
	const [detail, setDetail] = useState(false);
	const [hero] = transaction.withImageUrl;

	useRenderLogger({
		logger: getRootLogger(),
		name: "TransactionHero",
	});

	return (
		<>
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

				<Container data-ui-inner={"default"}>
					<Group>
						<LabelValue
							textLabel={translator.text("Listing price (label)")}
							textValue={
								<ListingPrice price={transaction as ListingPriceSchema.Type} />
							}
						/>

						<LabelValue
							textLabel={translator.text("Listing location (label)")}
							textValue={transaction.location.address}
							textValueProps={{
								"data-ui-truncate": false,
								"data-ui-wrap": "wrap",
							}}
							data-ui-width={"full"}
						/>
					</Group>
				</Container>
			</Container>

			<ListingSheet
				_suspense={_suspense}
				listingId={transaction.listingId}
				state={{
					value: detail,
					set: setDetail,
				}}
			/>
		</>
	);
};
