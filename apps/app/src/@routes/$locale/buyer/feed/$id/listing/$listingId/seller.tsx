import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute(
	"/$locale/buyer/feed/$id/listing/$listingId/seller",
)({
	component() {
		const { locale, id, listingId } = Route.useParams();

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/$id/listing/$listingId/view"}
						params={{
							locale,
							id,
							listingId,
						}}
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
