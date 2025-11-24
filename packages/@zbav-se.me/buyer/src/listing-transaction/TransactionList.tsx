import type { MarkSuspense } from "@use-pico/client/type";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { Fade } from "@zbav-se.me/ui/fade";
import { type FC, type ReactNode, useRef } from "react";
import { EmptyList } from "./EmptyList";
import { TransactionItem } from "./TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props, MarkSuspense.Props {
		locale: string;
		emptyAction: ReactNode;
		renderItemFn: TransactionItem.Item.RenderFn;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({
	_suspense,
	locale,
	emptyAction,
	renderItemFn,
	...props
}) => {
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
				<withListingTransactionCollectionQuery.Suspense
					data={{
						sort: [
							{
								field: "updatedAt",
								direction: "desc",
							},
						],
						meta: {
							side: "buyer",
						},
					}}
					options={{
						refetchInterval: 10_000,
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => {
						return (
							<>
								{data.data.length > 0
									? data.data.map((item) => (
											<TransactionItem
												key={item.id}
												listingTransaction={item}
												locale={locale}
												item={renderItemFn}
											/>
										))
									: null}

								{data.data.length > 0 ? null : (
									<Container
										layout={"vertical-centered"}
										items={"center"}
									>
										<EmptyList action={emptyAction} />
									</Container>
								)}
							</>
						);
					}}
				</withListingTransactionCollectionQuery.Suspense>
			</Container>
		</Container>
	);
};
