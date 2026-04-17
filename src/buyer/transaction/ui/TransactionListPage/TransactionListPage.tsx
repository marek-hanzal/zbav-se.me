import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { useLocale } from "@/lib/client/locale";
import type { MarkSuspense } from "@/lib/client/type";
import { translator } from "@/lib/common/translator";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { withTransactionQuery } from "../../query/withTransactionQuery";
import { Empty } from "../TransactionList/Empty";
import { ListGroup } from "./ListGroup";

export namespace TransactionListPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		refetchInterval?: number;
	}
}

export const TransactionListPage: FC<TransactionListPage.Props> = ({
	_suspense,
	refetchInterval = 5_000,
	...props
}) => {
	const locale = useLocale();
	const { data: hasTransaction } = withTransactionQuery.useCollectionQuery({
		cursor: {
			page: 0,
			size: 1,
		},
	});

	const check = useMemo(() => {
		return [
			{
				check() {
					return !hasTransaction.length;
				},
				render() {
					return <Empty />;
				},
			},
		] satisfies EmptyState.Check[];
	}, [
		hasTransaction,
	]);

	return (
		<TitleContainer
			data-ui="TransactionListPage"
			textTitle={translator.text("Messages (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<EmptyState check={check}>
				<Container
					ui={{
						scroll: "vertical",
						height: "full",
						layout: "vertical-flex",
						gap: "2xl",
						inner: "default",
					}}
				>
					<ListGroup
						label={translator.text("Transactions - seller-to-buyer - buyer (title)")}
						filter={{
							flow: "seller-to-buyer",
						}}
						refetchInterval={refetchInterval}
						typoUi={{
							tone: "primary",
							theme: "light",
						}}
					/>

					<ListGroup
						label={translator.text("Transactions - buyer-to-seller - buyer (title)")}
						filter={{
							flow: "buyer-to-seller",
						}}
						refetchInterval={refetchInterval}
						typoUi={{
							tone: "neutral",
							theme: "light",
							opacity: "7",
							font: "normal",
						}}
					/>

					<ListGroup
						label={translator.text("Transactions - archived - buyer (title)")}
						filter={{
							flow: "archived",
							activity: "archived",
						}}
						refetchInterval={refetchInterval}
						ui={{
							opacity: "7",
						}}
						typoUi={{
							tone: "neutral",
							theme: "light",
							opacity: "7",
							font: "normal",
						}}
					/>
				</Container>
			</EmptyState>
		</TitleContainer>
	);
};
