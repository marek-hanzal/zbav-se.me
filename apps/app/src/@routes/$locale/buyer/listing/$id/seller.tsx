import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/listing/$id/seller")({
	component() {
		const { locale, id } = Route.useParams();

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
