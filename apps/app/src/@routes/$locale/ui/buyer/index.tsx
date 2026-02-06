import { useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useEffect } from "react";
import { BuyerMenu } from "~/app/@buyer-user/menu/ui/BuyerMenu";
import { withSessionQuery } from "~/app/@common/auth/query/withSessionQuery";

export const Route = createFileRoute("/$locale/ui/buyer/")({
	component() {
		const queryClient = useQueryClient();
		const mutation = withUserExPatchMutation.useMutation({
			onSuccess() {
				withSessionQuery.invalidate(queryClient);
			},
		});

		useEffect(() => {
			mutation.mutate({
				patch: {
					side: "buyer",
				},
			});
		}, []);

		return (
			<TitleContainer
				data-ui={"/buyer/index[TitleContainer]"}
				textTitle={"Buyer home (title)"}
				ui={{
					layout: "vertical-header-content",
				}}
			>
				<BuyerMenu />
			</TitleContainer>
		);
	},
});
