import { useQueryClient } from "@tanstack/react-query";
import { createLazyFileRoute } from "@tanstack/react-router";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useEffect } from "react";
import { SellerMenu } from "~/app/@seller/ui/SellerMenu";
import { withSessionQuery } from "~/app/auth/query/withSessionQuery";

export const Route = createLazyFileRoute("/$locale/ui/seller/")({
	component() {
		const queryClient = useQueryClient();
		const mutation = withUserExPatchMutation.useMutation({
			onSuccess() {
				withSessionQuery.invalidate(queryClient);
			},
		})

		useEffect(() => {
			mutation.mutate({
				patch: {
					side: "seller",
				},
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
				<SellerMenu />
			</TitleContainer>
		)
	},
});
