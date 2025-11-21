import { useParams } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { EmptyList } from "@zbav-se.me/buyer/listing-transaction";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { Fade } from "@zbav-se.me/ui/fade";
import { type FC, useRef } from "react";
import { TransactionItem } from "~/app/@buyer/listing-transaction/ui/TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props {}
}

export const TransactionList: FC<TransactionList.Props> = (props) => {
	const { locale } = useParams({
		from: "/$locale",
	});
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
					side: "buyer",
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
								listingTransaction={item}
							/>
						))
					: null}

				{listingTransactionCollectionQuery.data.data.length > 0 ? null : (
					<Container
						layout={"vertical-centered"}
						items={"center"}
					>
						<EmptyList
							action={
								<LinkTo
									to={"/$locale/buyer/feed/select"}
									params={{
										locale,
									}}
								>
									<Button
										iconEnabled={ArrowRightIcon}
										iconPosition={"right"}
										label={"Feed selection (button)"}
										size={"xl"}
										tone={"primary"}
										theme={"dark"}
									/>
								</LinkTo>
							}
						/>
					</Container>
				)}
			</Container>
		</Container>
	);
};
