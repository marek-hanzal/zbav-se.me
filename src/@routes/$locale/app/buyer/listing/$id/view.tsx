import { createFileRoute } from "@tanstack/react-router";
import { useLocale } from "@/lib/client/locale";
import { useRenderLogger } from "@/lib/client/log";
import { SpinnerContainer } from "@/lib/client/spinner";
import { useTranslator } from "@/lib/client/translation";
import { withListingQuery } from "~/buyer/listing/query/withListingQuery";
import { ListingCard } from "~/buyer/listing/ui/ListingCard";
import { getRootLogger } from "~/common/log/getRootLogger";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/buyer/listing/$id/view")({
	pendingComponent: () => {
		const translator = useTranslator();
		const locale = useLocale();

		return (
			<TitleContainer
				data-ui={"ListingViewPending[TitleContainer]"}
				textTitle={translator.text("Listing title (title)")}
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
			logger: getRootLogger(),
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
