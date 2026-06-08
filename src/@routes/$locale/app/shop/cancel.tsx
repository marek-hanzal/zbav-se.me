import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { CancelIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

export const Route = createFileRoute("/$locale/app/shop/cancel")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle="Shop cancel (title)"
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
						textTitle="Shop cancel status (title)"
						textMessage="Shop cancel status (message)"
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
