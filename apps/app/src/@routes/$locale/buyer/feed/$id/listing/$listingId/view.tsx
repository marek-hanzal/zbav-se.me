import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { withListingFetchQuery } from "@zbav-se.me/sdk/query";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute(
	"/$locale/buyer/feed/$id/listing/$listingId/view",
)({
	component() {
		const { locale, id, listingId } = Route.useParams();
		const listingQuery = withListingFetchQuery.useSuspenseQuery({
			where: {
				id: listingId,
			},
		});

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/list"}
						params={{
							locale,
							id,
						}}
						tone={"secondary"}
					/>
				}
				textTitle={listingQuery.data.title}
			>
				bello
			</TitleContainer>
		);
	},
});
