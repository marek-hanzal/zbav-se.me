import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { EmptyList } from "@zbav-se.me/seller/listing-transaction";
import { Fade } from "@zbav-se.me/ui/fade";
import { type FC, useRef } from "react";
import { TransactionItem } from "~/app/@seller/listing-transaction/ui/TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({ _suspense, locale, ...props }) => {
	const listingTransactionCollectionQuery =
		withListingTransactionCollectionQuery.useSuspenseQuery(
			{
				sort: [
					{
						field: "updatedAt",
						direction: "desc",
					},
				],
				meta: {
					side: "seller",
				},
			},
			{
				refetchInterval: 10_000,
			},
		);

	const containerRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			position={"relative"}
			style={{
				contain: "content",
			}}
		>
			<Fade scrollableRef={containerRef} />

			<Container
				ref={containerRef}
				ui="TransactionList-root"
				layout={"vertical-flex"}
				gap={"md"}
				scroll={"vertical"}
				{...props}
			>
				{listingTransactionCollectionQuery.data.data.length > 0
					? listingTransactionCollectionQuery.data.data.map((item) => (
							<TransactionItem
								key={item.id}
								locale={locale}
								listingTransaction={item}
							/>
						))
					: null}

				{listingTransactionCollectionQuery.data.data.length > 0 ? null : (
					<Container
						layout={"vertical-centered"}
						items={"center"}
					>
						<EmptyList />
					</Container>
				)}
			</Container>
		</Container>
	);
};
