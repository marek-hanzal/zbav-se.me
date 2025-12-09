import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@use-pico/client/icon";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SellerIcon } from "@zbav-se.me/ui/icon";
import { useEffect } from "react";
import { SellerMenu } from "~/app/@seller/ui/SellerMenu";

export const Route = createFileRoute("/$locale/seller/")({
	component() {
		const { locale } = Route.useParams();
		const mutation = withUserExPatchMutation.useMutation();

		useEffect(() => {
			mutation.mutate({
				side: "seller",
			});
		}, []);

		return (
			<TitleContainer
				data-ui="Seller-root"
				textTitle={"Seller home (title)"}
				left={
					<Icon
						icon={SellerIcon}
						ui={{
							size: "xl",
						}}
					/>
				}
				ui={{
					tone: "secondary",
					theme: "light",
				}}
			>
				<SellerMenu locale={locale} />
			</TitleContainer>
		);
	},
});
