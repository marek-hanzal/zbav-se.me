import { type FC, useState } from "react";
import { HeroImage } from "~/application-ui/ui/img.exports";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import { ListingSheet } from "~/buyer-transaction/ui/Transaction/ListingSheet/index";
import type { ListingPriceSchema } from "~/listing/schema/ListingPriceSchema";
import { ListingPrice } from "~/listing/ui/ListingPrice";
import { getRootLogger } from "~/log/fn/getRootLogger";
import { useTranslator } from "~/translation/hook/useTranslator";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import type { MarkSuspense } from "~/ui/type/MarkSuspense";
import { Container } from "~/ui/ui/Container";
import { Group } from "~/ui/ui/Group";
import { LabelValue } from "~/ui/ui/LabelValue";

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
