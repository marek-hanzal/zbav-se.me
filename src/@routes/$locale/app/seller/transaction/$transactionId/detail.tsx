import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { withTransactionQuery } from "~/seller-transaction/query/withTransactionQuery";
import { Transaction } from "~/seller-transaction/ui/Transaction";
import { useTranslator } from "~/translation/hook/useTranslator";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/seller/transaction/$transactionId/detail")({
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Messages (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/seller/transaction/list"
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
		const { transactionId } = Route.useParams();

		const translator = useTranslator();
		const locale = useLocale();
		const { data: transaction } = withTransactionQuery.useFetchQuery(transactionId);

		return (
			<TitleContainer
				textTitle={translator.text("Messages (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/seller/transaction/$listingId/list"
						params={{
							locale,
							listingId: transaction.listingId,
						}}
					/>
				}
				right={<HomeMenuButton />}
			>
				<Transaction
					_suspense={"I know"}
					transactionId={transactionId}
					refresh={1_000 * 5}
				/>
			</TitleContainer>
		);
	},
});
