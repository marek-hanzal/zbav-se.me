import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@use-pico/client/icon";
import { withUserExPatchMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { BuyerIcon } from "@zbav-se.me/ui/icon";
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
				data-ui={"BuyerHome"}
				textTitle={"Buyer home (title)"}
				left={
					<Icon
						icon={BuyerIcon}
						ui={{
							size: "lg",
						}}
					/>
				}
				ui={{
					layout: "vertical-header-content",
				}}
			>
				<BuyerMenu locale={locale} />
			</TitleContainer>
		);
	},
});
