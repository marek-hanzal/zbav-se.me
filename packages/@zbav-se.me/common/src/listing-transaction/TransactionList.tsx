import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { Status } from "@use-pico/client/ui/status";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { Fade } from "@zbav-se.me/ui/fade";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import { type FC, type ReactNode, useRef } from "react";
import { TransactionItem } from "./TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props {
		locale: string;
		side: tUserSideEnum;
		renderEmptyFn(props: Status.Props): ReactNode;
		renderItemFn: TransactionItem.Item.RenderFn;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({
	locale,
	side,
	renderEmptyFn,
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
			<Fade
				height={48}
				scrollableRef={containerRef}
			/>

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
						where: {
							statusIn: [
								"request",
								"accepted",
							],
						},
						sort: [
							{
								field: "updatedAt",
								direction: "desc",
							},
						],
						meta: {
							side,
						},
					}}
					options={{
						refetchInterval: 5_000,
					}}
					fallback={<SpinnerContainer />}
				>
					{({ data }) => {
						if (data.data.length > 0) {
							return data.data.map((item) => (
								<TransactionItem
									key={item.id}
									listingTransaction={item}
									locale={locale}
									renderItemFn={renderItemFn}
								/>
							));
						}

						return (
							<Container
								layout={"vertical-centered"}
								items={"center"}
							>
								{renderEmptyFn({
									icon: TransactionIcon,
								})}
							</Container>
						);
					}}
				</withListingTransactionCollectionQuery.Suspense>
			</Container>
		</Container>
	);
};
