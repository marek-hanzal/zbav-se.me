import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { ListingHero } from "~/seller/listing/ui/ListingHero";
import { TransactionList } from "~/seller/listing/ui/TransactionList";
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
