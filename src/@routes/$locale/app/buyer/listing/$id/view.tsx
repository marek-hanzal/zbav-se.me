import { createFileRoute } from "@tanstack/react-router";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { withListingQuery } from "~/buyer-listing/query/withListingQuery";
import { ListingCard } from "~/buyer-listing/ui/ListingCard/index";
import { useLocale } from "~/locale/hook/useLocale";
import { getRootLoggerFn } from "~/log/fn/getRootLoggerFn";
import { BackHomeButton } from "~/nav/ui/BackHomeButton.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { useRenderLogger } from "~/ui/hook/useRenderLogger";
import { SpinnerContainer } from "~/ui/ui/SpinnerContainer";
import { HomeMenuButton } from "~/user-home/ui/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/buyer/listing/$id/view")({
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui={"ListingViewPending[TitleContainer]"}
				textTitle={translator.textFn("Listing title (title)")}
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
		const { id } = Route.useParams();

		const listingId = id;

		const locale = useLocale();
		const { data: listing } = withListingQuery.useFetchQuery(listingId);

		useRenderLogger({
			logger: getRootLoggerFn(),
			name: "ListingView",
			meta: {
				listingId,
			},
		});

		return (
			<TitleContainer
				data-ui={"ListingView[TitleContainer]"}
				textTitle={listing.title}
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
				<ListingCard
					_suspense={"I know"}
					listingId={listingId}
					data-ui-height="full"
					data-ui-scroll="vertical"
				/>
			</TitleContainer>
		);
	},
});
