import { createFileRoute } from "@tanstack/react-router";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useEffect } from "react";
import { BuyerMenu } from "~/app/@buyer/ui/BuyerMenu";

export const Route = createFileRoute("/$locale/buyer/")({
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
				ui={"BuyerHome-root"}
				textTitle={"Buyer home (title)"}
			>
				<BuyerMenu locale={locale} />
			</TitleContainer>
		);
	},
});
