import { useScrollTo } from "@use-pico/client/hook";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Fade } from "@use-pico/client/ui/fade";
import type { Status } from "@use-pico/client/ui/status";
import type { StateType } from "@use-pico/common/type";
import type { tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { withListingTransactionCollectionQuery } from "@zbav-se.me/sdk/query/user";
import { TransactionIcon } from "@zbav-se.me/ui/icon";
import { type FC, type ReactNode, useEffect, useRef } from "react";
import { TransactionItem } from "./TransactionItem";

export namespace TransactionList {
	export interface Props extends Container.Props {
		locale: string;
		side: tUserSideEnum;
		renderEmptyFn(props: Status.Props): ReactNode;
		state: StateType.Simple<string | undefined>;
	}
}

export const TransactionList: FC<TransactionList.Props> = ({
	locale,
	side,
	renderEmptyFn,
	state,
	...props
}) => {
	const containerRef = useRef<HTMLDivElement>(null);

	const scrollTo = useScrollTo(containerRef);

	return (
		<Container
			position={"relative"}
			style={{
				contain: "content",
			}}
		>
			<Fade
				height={16}
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
						// biome-ignore lint/correctness/useHookAtTopLevel: Ssst
						useEffect(() => {
							if (state.value) {
								scrollTo(`[data-id="${state.value}"]`);
							}
						}, [
							state.value,
						]);

						if (data.data.length > 0) {
							return data.data.map((item) => (
								<TransactionItem
									key={item.id}
									side={side}
									listingTransaction={item}
									locale={locale}
									open={state}
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
