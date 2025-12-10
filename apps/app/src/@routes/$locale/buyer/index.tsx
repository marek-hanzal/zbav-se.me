import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
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
				data-ui={"/buyer/index[TitleContainer]"}
				textTitle={"Buyer home (title)"}
				left={
					<Container
						data-ui={"/buyer/index-[Container.left]"}
						ui={{
							layout: "horizontal-flex",
							justify: "center",
							items: "center",
							round: "full",
							square: "default",
							background: "default",
							border: true,
							shadow: true,
							color: "text",
							text: "xl",
							opacity: "low",
						}}
					>
						<Icon
							data-ui={"/buyer/index-[Icon.left]"}
							icon={BuyerIcon}
						/>
					</Container>
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
