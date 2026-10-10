import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { withTransactionQuery } from "~/buyer-transaction/query/withTransactionQuery";
import { Empty } from "~/buyer-transaction/ui/TransactionList/Empty";
import { ListGroup } from "~/buyer-transaction/ui/TransactionList/ListGroup";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import { EmptyState } from "~/ui/ui/EmptyState";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/buyer/transaction/list")({
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui="TransactionList[TitleContainer]"
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
			>
				<SpinnerContainer />
			</TitleContainer>
		);
	},
	component() {
		const refetchInterval = 5_000;

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
				data-ui="TransactionList[TitleContainer]"
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
							label={translator.text(
								"Transactions - seller-to-buyer - buyer (title)",
							)}
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
							label={translator.text(
								"Transactions - buyer-to-seller - buyer (title)",
							)}
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
	},
});
