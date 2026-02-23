import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { MessageIcon } from "@zbav-se.me/ui/icon";
import type { FC, ReactNode } from "react";

export namespace TransactionListContainer {
	export interface Item {
		id: string;
	}

	export interface Props extends Container.Props {
		query: unknown;
		suspense: {
			Suspense: FC<any>;
		};
		renderItem(item: Item): ReactNode;
		emptyTitle: string;
		emptyMessage: string;
		emptyActionTo: string;
		emptyActionLabel: string;
		refetchInterval?: number;
	}
}

export const TransactionListContainer: FC<TransactionListContainer.Props> = ({
	query,
	suspense,
	renderItem,
	emptyTitle,
	emptyMessage,
	emptyActionTo,
	emptyActionLabel,
	refetchInterval = 5_000,
	ui,
	...props
}) => {
	const locale = useLocale();
	const SuspenseQuery = suspense.Suspense;

	return (
		<Container
			ui={{
				scroll: "vertical",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<SuspenseQuery
				data={query}
				fallback={<SpinnerContainer />}
				options={{
					refetchInterval,
				}}
			>
				{({ data }: { data: TransactionListContainer.Item[] }) => {
					if (data.length === 0) {
						return (
							<Container
								ui={{
									layout: "vertical-centered",
									height: "full",
								}}
							>
								<Status
									icon={MessageIcon}
									textTitle={emptyTitle}
									textMessage={emptyMessage}
									action={
										<LinkTo
											icon={ChevronRightIcon}
											iconPosition={"right"}
											to={emptyActionTo}
											params={{
												locale,
											}}
											ui={{
												background: "default",
												border: true,
												shadow: true,
												round: "default",
												size: "default",
											}}
										>
											<Tx label={emptyActionLabel} />
										</LinkTo>
									}
									ui={{
										tone: "brand",
										theme: "light",
										inner: "4xl",
									}}
									className="text-center"
								/>
							</Container>
						);
					}

					return (
						<Container
							ui={{
								layout: "vertical-flex",
								gap: "default",
							}}
						>
							{data.map((item) => renderItem(item))}
						</Container>
					);
				}}
			</SuspenseQuery>
		</Container>
	);
};
