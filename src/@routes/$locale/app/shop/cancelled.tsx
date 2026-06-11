import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";

const CancelledIcon = "icon-[material-symbols--event-available-rounded]";

export const Route = createFileRoute("/$locale/app/shop/cancelled")({
	component() {
		const { locale } = Route.useParams();

		return (
			<TitleContainer
				textTitle="Shop cancelled (title)"
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
						icon={CancelledIcon}
						textTitle="Shop cancelled status (title)"
						textMessage="Shop cancelled status (message)"
						data-ui-tone="brand"
						data-ui-theme="light"
						data-ui-color="lead"
						titleProps={{
							"data-ui-text": "xl",
						}}
						messageProps={{
							"data-ui-text": "default",
							className: "mt-2 text-center",
							components: {
								p: {
									"data-ui-justify": "center",
									className: "text-center",
								},
							},
						}}
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
