import { createFileRoute } from "@tanstack/react-router";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { useLocale } from "~/locale/hook/useLocale";
import { ListingHero } from "~/seller/listing/ui/ListingHero";
import { TransactionList } from "~/seller/listing/ui/TransactionList";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Container } from "~/ui/ui/Container";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/seller/transaction/$listingId/list")({
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui="ListingTransactionList[TitleContainer]"
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
				<Container
					data-ui-layout="vertical-centered"
					data-ui-height="full"
					data-ui-inner="default"
				>
					<SpinnerContainer />
				</Container>
			</TitleContainer>
		);
	},
	component() {
		const { listingId } = Route.useParams();

		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui="ListingTransactionList[TitleContainer]"
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
				<Container>
					<ListingHero
						_suspense={"I know"}
						listingId={listingId}
					/>

					<TransactionList
						_suspense={"I know"}
						listingId={listingId}
						data-ui-inner="default"
					/>
				</Container>
			</TitleContainer>
		);
	},
});
