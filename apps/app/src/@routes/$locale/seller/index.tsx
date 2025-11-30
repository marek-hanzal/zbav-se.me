import { createFileRoute } from "@tanstack/react-router";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useEffect } from "react";
import { SellerMenu } from "~/app/@seller/ui/SellerMenu";
import { SignOutButton } from "~/app/auth/ui/SignOutButton";

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
				ui="Seller-root"
				textTitle={"Seller home (title)"}
			>
				<SellerMenu locale={locale} />

				<SignOutButton
					locale={locale}
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
