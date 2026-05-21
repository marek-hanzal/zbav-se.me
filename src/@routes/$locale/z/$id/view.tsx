import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { translator as coolTranslator } from "@/lib/common/translation";
import { withTranslationsQuery } from "~/common/translation/query/withTranslationsQuery";
import { withListingPingFn } from "~/public/listing/fn/withListingPingFn";
import { withListingQuery } from "~/public/listing/query/withListingQuery";
import { PublicListingPage } from "~/public/listing/ui/PublicListingPage";
import { PublicListingPagePending } from "~/public/listing/ui/PublicListingPagePending";

function toSingleLine(value: string | null | undefined) {
	return value?.replace(/\s+/g, " ").trim() ?? "";
}

export const Route = createFileRoute("/$locale/z/$id/view")({
	async loader({ context: { queryClient }, params: { id, locale } }) {
		try {
			const listing = await withListingQuery.ensureFetchQuery(queryClient, id);
			const translations = await withTranslationsQuery.ensure(queryClient, {
				locale,
			});

			return {
				listing,
				translations,
			} as const;
		} catch {
			const ping = await withListingPingFn({
				data: {
					id,
				},
			});

			if (!ping) {
				throw notFound({
					throw: true,
				});
			}

			throw redirect({
				to: "/$locale/z/$id/unavailable",
				params: {
					id,
					locale,
				},
				throw: true,
			});
		}
	},
	head({ loaderData }) {
		if (!loaderData) {
			return {};
		}
		const { translations, listing } = loaderData;
		const translator = coolTranslator({
			translations,
		});

		const app = translator.text("zbav-se.me");
		const title = `${listing.title} | ${app}`;
		const description =
			toSingleLine(listing.description) ||
			toSingleLine(
				[
					`${listing.category.category} / ${listing.category.group}`,
					listing.location.address,
					translator.text("Browse listing on (label)"),
				].join(" | "),
			);
		const image = listing.withImageUrl[0];

		const meta = [
			{
				title,
			},
			{
				name: "description",
				content: description,
			},
			{
				property: "og:title",
				content: title,
			},
			{
				property: "og:description",
				content: description,
			},
			{
				name: "twitter:card",
				content: "summary_large_image",
			},
			{
				name: "twitter:title",
				content: title,
			},
			{
				name: "twitter:description",
				content: description,
			},
			{
				property: "og:image",
				content: image,
			},
			{
				name: "twitter:image",
				content: image,
			},
		];

		return {
			meta,
		};
	},
	component() {
		const { id } = Route.useParams();

		return (
			<PublicListingPage
				listingId={id}
				_suspense={"I know"}
			/>
		);
	},
	pendingComponent: PublicListingPagePending,
});
