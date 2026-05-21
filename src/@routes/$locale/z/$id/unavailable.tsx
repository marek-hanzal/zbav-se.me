import { createFileRoute } from "@tanstack/react-router";
import { translator as coolTranslator } from "@/lib/common/translation";
import { withTranslationsQuery } from "~/common/translation/query/withTranslationsQuery";
import { PublicListingUnavailablePage } from "~/public/listing/ui/PublicListingUnavailablePage";

export const Route = createFileRoute("/$locale/z/$id/unavailable")({
	async loader({ context: { queryClient }, params: { locale } }) {
		const translations = await withTranslationsQuery.ensure(queryClient, {
			locale,
		});

		return {
			translations,
		};
	},
	head({ loaderData }) {
		if (!loaderData) {
			return {};
		}

		const translator = coolTranslator({
			translations: loaderData.translations,
		});

		return {
			meta: [
				{
					title: `${translator.text("Listing unavailable (title)")} | ${translator.text("zbav-se.me")}`,
				},
				{
					name: "description",
					content: translator.text("Listing unavailable (description)"),
				},
			],
		};
	},
	component() {
		const { id: listingId } = Route.useParams();

		return <PublicListingUnavailablePage listingId={listingId} />;
	},
});
