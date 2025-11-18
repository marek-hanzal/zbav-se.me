import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/seller/transaction/$id/buyer/info")({
	component() {
		const { locale, id } = Route.useParams();

		return (
			<TitleContainer
				ui="BuyerInfo-root"
				textTitle="Buyer info (title)"
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/seller/transaction/$id/view"}
						params={{
							locale,
							id,
						}}
					/>
				}
			>
				buyer
			</TitleContainer>
		);
	},
});
