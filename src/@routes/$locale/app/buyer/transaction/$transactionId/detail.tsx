import { createFileRoute } from "@tanstack/react-router";
import { Transaction } from "~/buyer/transaction/ui/Transaction/Transaction";
import { getRootLogger } from "~/common/log/getRootLogger";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/buyer/transaction/$transactionId/detail")({
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				textTitle={translator.text("Messages (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/buyer/transaction/list"
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

		useRenderLogger({
			logger: getRootLogger(),
			name: "TransactionDetail",
		});

		return (
			<TitleContainer
				data-ui={"TransactionDetail[TitleContainer]"}
				textTitle={translator.text("Messages (title)")}
				left={
					<BackHomeButton
						to="/$locale/app/buyer/transaction/list"
						params={{
							locale,
						}}
					/>
				}
				right={<HomeMenuButton />}
			>
				<Transaction
					_suspense={"I know"}
					transactionId={transactionId}
					refresh={5 * 1_000}
				/>
			</TitleContainer>
		);
	},
});
