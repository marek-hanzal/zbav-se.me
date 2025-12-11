import { createFileRoute } from "@tanstack/react-router";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useEffect } from "react";
import { SellerMenu } from "~/app/@seller/ui/SellerMenu";

export const Route = createFileRoute("/$locale/ui/seller/")({
	component() {
		const { locale } = Route.useParams();
		const mutation = withUserExPatchMutation.useMutation();

		useEffect(() => {
			mutation.mutate({
				side: "seller",
			})
		}, []);

		return (
			<TitleContainer
				data-ui="Seller-root"
				textTitle={"Seller home (title)"}
				ui={{
					layout: "vertical-header-content",
					tone: "secondary",
					theme: "light",
				}}
			>
				<SellerMenu locale={locale} />
			</TitleContainer>
		)
	},
});
