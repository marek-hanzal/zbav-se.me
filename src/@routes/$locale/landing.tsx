import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { uiButton } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon, GitHubIcon, Icon } from "@/lib/client/icon";
import { LinkTo, uiLinkTo } from "@/lib/client/link-to";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import face from "~/assets/face.webp";
import { HeroImage } from "~/common/ui/img";
import { Logo } from "~/common/ui/logo";
import { History } from "~/public/ui/History";
import { HistoryPending } from "~/public/ui/HistoryPending";

export const Route = createFileRoute("/$locale/landing")({
	component() {
		const translator = useTranslator();
		const { locale } = Route.useParams();

		return (
			<Container
				data-ui-layout={"vertical-full"}
				data-ui-width={"full"}
				data-ui-height={"full"}
				data-ui-gap={"xl"}
				data-ui-snap={"vertical"}
				data-ui-snap-align={"center"}
			>
				<Container
					data-ui-layout={"vertical-centered"}
					data-ui-flow={"vertical"}
					data-ui-tone={"brand"}
					data-ui-theme={"light"}
					data-ui-background={"alt"}
					data-ui-inner={"xl"}
					data-ui-gap={"xl"}
				>
					<Container
						data-ui-layout="horizontal"
						data-ui-height="auto"
						data-ui-width="full"
					>
						<Logo />
					</Container>

					<Status
						textTitle={translator.text("Landing - Hero (title)")}
						messageProps={{
							className: "text-center",
						}}
						data-ui-tone="primary"
						data-ui-theme="light"
						data-ui-color="lead"
					>
						<Container
							data-ui-layout="vertical-flex"
							data-ui-inner="4xl"
							data-ui-gap="xl"
						>
							<LinkTo
								data-action={"goto sign-in"}
								{...uiButton({})}
								//
								data-ui-tone={"secondary"}
								data-ui-theme={"light"}
								data-ui-size={"default"}
								data-ui-text={"xl"}
								data-ui-justify={"center"}
								//
								icon={ChevronRightIcon}
								iconPosition={"right"}
								iconProps={{
									"data-ui-text": "2xl",
								}}
								preload={"intent"}
								to={"/$locale/sign-in"}
								params={{
									locale,
								}}
							>
								<Tx label={"Login (hero)"} />
							</LinkTo>

							<LinkTo
								data-action={"goto sign-up"}
								{...uiButton({})}
								//
								data-ui-tone={"primary"}
								data-ui-theme={"light"}
								data-ui-size={"default"}
								data-ui-text={"xl"}
								data-ui-justify={"center"}
								//
								icon={ChevronRightIcon}
								iconPosition={"right"}
								iconProps={{
									"data-ui-text": "2xl",
								}}
								preload={"intent"}
								to={"/$locale/sign-up"}
								params={{
									locale,
								}}
							>
								<Tx label={"Register (hero)"} />
							</LinkTo>
						</Container>
					</Status>
				</Container>

				<Container
					data-ui-layout="vertical-centered"
					data-ui-height="full"
					data-ui-width="full"
				>
					<Status
						icon={
							<HeroImage
								src={face}
								visible
								data-ui-tone="brand"
								data-ui-theme="dark"
								data-ui-border
								data-ui-shadow
								data-ui-round="full"
								className={[
									"aspect-square",
									"w-[85%]",
								]}
								loading={"lazy"}
								decoding={"async"}
								fetchPriority={"low"}
							/>
						}
						textTitle={translator.text("About me (title)")}
						textMessage={translator.text("About me (message)")}
						messageProps={{
							"data-ui-color": "text",
						}}
						action={
							<a
								href={"https://github.com/marek-hanzal/zbav-se.me"}
								target={"blank"}
								{...uiLinkTo({})}
							>
								<Icon
									icon={GitHubIcon}
									data-ui-text={"2xl"}
								/>
							</a>
						}
						data-ui-tone={"brand"}
						data-ui-theme={"light"}
						data-ui-color={"lead"}
					/>
				</Container>

				<Container
					data-ui-height="full"
					data-ui-width="full"
					data-ui-inner="xl"
				>
					<Suspense fallback={<HistoryPending />}>
						<History _suspense={"I know"} />
					</Suspense>
				</Container>
			</Container>
		);
	},
});
