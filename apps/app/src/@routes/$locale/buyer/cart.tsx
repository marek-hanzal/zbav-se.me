import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Typo } from "@use-pico/client/ui/typo";
import { TitleContainer } from "@zbav-se.me/ui/container";

export const Route = createFileRoute("/$locale/buyer/cart")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer"}
						params={{
							locale,
						}}
						tone={"secondary"}
					/>
				}
				textTitle={"Your cart (title)"}
			>
				<Typo
					label={
						"Create endpoint returning all categories from the cart, e.g. /api/category/cart/collection; will be faster than doing some shit around"
					}
					size={"xl"}
					font={"bold"}
				/>

				<div>
					Cart listing should have at least different overlay of tools
					(e.g. remove, write to seller, ...)
				</div>
			</TitleContainer>
		);
	},
});
