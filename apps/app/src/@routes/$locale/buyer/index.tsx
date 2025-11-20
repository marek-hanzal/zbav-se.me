import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon } from "@use-pico/client/icon";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";
import { BuyerMenu } from "~/app/buyer/ui/BuyerMenu";

export const Route = createFileRoute("/$locale/buyer/")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle={"Buyer home (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to="/$locale/dashboard"
						params={{
							locale,
						}}
					/>
				}
			>
				<BuyerMenu />

				<SignOutButton
					tweak={{
						slot: {
							wrapper: {
								class: [
									"mx-auto",
								],
							},
						},
					}}
				/>
			</TitleContainer>
		);
	},
});
