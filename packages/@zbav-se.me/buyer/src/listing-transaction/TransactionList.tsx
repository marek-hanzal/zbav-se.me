import type { MarkSuspense } from "@use-pico/client/type";
import { Container } from "@use-pico/client/ui/container";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { Fade } from "@zbav-se.me/ui/fade";
import { type FC, type ReactNode, useRef } from "react";
import { EmptyList } from "./EmptyList";
import { TransactionItem } from "./TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		emptyAction: ReactNode;
		renderItem: TransactionItem.Item.RenderFn;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({
	_suspense,
	locale,
	emptyAction,
	renderItem,
	...props
}) => {
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
								locale={locale}
								item={renderItem}
							/>
						))
					: null}

				{listingTransactionCollectionQuery.data.data.length > 0 ? null : (
					<Container
						layout={"vertical-centered"}
						items={"center"}
					>
						<EmptyList action={emptyAction} />
					</Container>
				)}
			</Container>
		</Container>
	);
};
