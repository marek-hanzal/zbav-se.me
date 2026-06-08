import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { CancelIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { TitleContainer } from "~/common/ui/container";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/shop/cancel")({
	component() {
		const { locale } = Route.useParams();
		const translator = useTranslator();

		return (
			<TitleContainer
				textTitle={translator.text("Shop cancel (title)", "Platba zrušena")}
				left={
					<BackHomeButton
						to="/$locale/app/home"
						params={{
							locale,
						}}
					/>
				}
				right={<HomeMenuButton />}
			>
				<Container data-ui-layout="vertical-centered">
					<Status
						icon={CancelIcon}
						textTitle={translator.text(
							"Shop cancel status (title)",
							"Nic jsme si nevzali",
						)}
						textMessage={translator.text(
							"Shop cancel status (message)",
							"Checkout jsi zavřel před potvrzením, takže jsme nic neúčtovali.",
						)}
						data-ui-tone="brand"
						data-ui-theme="light"
						data-ui-color="lead"
						action={
							<LinkTo
								data-action="goto shop browse"
								icon={ChevronRightIcon}
								iconPosition="right"
								to="/$locale/app/shop/browse"
								params={{
									locale,
								}}
								{...uiCtaLinkButton({})}
							>
								<Tx label="Back to shop (button)" />
							</LinkTo>
						}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
