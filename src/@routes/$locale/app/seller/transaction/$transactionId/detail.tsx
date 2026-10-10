import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { withTransactionQuery } from "~/seller/transaction/query/withTransactionQuery";
import { Transaction } from "~/seller/transaction/ui/Transaction";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

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
