import { createFileRoute } from "@tanstack/react-router";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useEffect } from "react";
import { BuyerMenu } from "~/app/@buyer/ui/BuyerMenu";

export const Route = createFileRoute("/$locale/ui/buyer/")({
	component() {
		const { locale } = Route.useParams();
		const mutation = withUserExPatchMutation.useMutation();

		useEffect(() => {
			mutation.mutate({
				side: "buyer",
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
				<BuyerMenu locale={locale} />
			</TitleContainer>
		);
	},
});
