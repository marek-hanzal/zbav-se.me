import { type FC, useMemo } from "react";
import { Container } from "@/lib/client/container";
import { EmptyState } from "@/lib/client/empty-state";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import type { MarkSuspense } from "@/lib/client/type";
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
	const translator = useTranslator();
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
					data-ui-scroll="vertical"
					data-ui-height="full"
					data-ui-layout="vertical-flex"
					data-ui-gap="2xl"
					data-ui-inner="default"
				>
					<ListGroup
						label={translator.text("Transactions - seller-to-buyer - buyer (title)")}
						where={{
							flow: "seller-to-buyer",
						}}
						refetchInterval={refetchInterval}
						typoProps={{
							"data-ui-tone": "primary",
							"data-ui-theme": "light",
						}}
					/>

					<ListGroup
						label={translator.text("Transactions - buyer-to-seller - buyer (title)")}
						where={{
							flow: "buyer-to-seller",
						}}
						refetchInterval={refetchInterval}
						typoProps={{
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
							"data-ui-opacity": "7",
							"data-ui-font": "normal",
						}}
					/>

					<ListGroup
						label={translator.text("Transactions - archived - buyer (title)")}
						where={{
							flow: "archived",
							activity: "archived",
						}}
						refetchInterval={refetchInterval}
						data-ui-opacity="7"
						typoProps={{
							"data-ui-tone": "neutral",
							"data-ui-theme": "light",
							"data-ui-opacity": "7",
							"data-ui-font": "normal",
						}}
					/>
				</Container>
			</EmptyState>
		</TitleContainer>
	);
};
