import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { zListingQuery } from "@zbav-se.me/sdk/api/session";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/listing/$id/seller")({
	validateSearch: zListingQuery,
	component() {
		const { locale, id } = Route.useParams();
		const query = Route.useSearch();

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/listing/$id/view"}
						params={{
							locale,
							id,
						}}
						search={query}
						tone={"secondary"}
					/>
				}
				textTitle={"Listing - Seller info (title)"}
			>
				Seller info
			</TitleContainer>
		);
	},
});
