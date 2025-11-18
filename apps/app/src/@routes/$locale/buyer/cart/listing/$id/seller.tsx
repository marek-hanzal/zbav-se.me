import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { CategoryIdQuerySchema } from "~/app/category/schema/CategoryIdQuerySchema";

export const Route = createFileRoute("/$locale/buyer/cart/listing/$id/seller")({
	validateSearch: CategoryIdQuerySchema,
	component() {
		const { locale, id } = Route.useParams();
		const query = Route.useSearch();

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/cart/listing/$id/view"}
						params={{
							locale,
							id,
						}}
						search={query}
					/>
				}
				textTitle={"Listing - Seller info (title)"}
			>
				Seller info
			</TitleContainer>
		);
	},
});
