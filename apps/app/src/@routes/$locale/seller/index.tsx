import { createFileRoute } from "@tanstack/react-router";
import { Icon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
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
					<Container
						ui={{
							layout: "horizontal-flex",
							justify: "center",
							items: "center",
							round: "full",
							square: "default",
							opacity: "subtle",
							background: "default",
							border: true,
							shadow: true,
							color: "text",
							text: "xl",
						}}
					>
						<Icon icon={SellerIcon} />
					</Container>
				}
				ui={{
					layout: "vertical-header-content",
					tone: "secondary",
					theme: "light",
				}}
			>
				<SellerMenu locale={locale} />
			</TitleContainer>
		);
	},
});
