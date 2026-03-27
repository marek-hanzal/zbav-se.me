import { createFileRoute } from "@tanstack/react-router";
import { ChevronRightIcon, GitHubIcon, Icon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo, uiLinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { HeroImage } from "@zbav-se.me/ui/img";
import { Logo } from "@zbav-se.me/ui/logo";
import { Suspense } from "react";
import face from "~/assets/face.webp";
import { History } from "~/client/@public/ui/History";
import { HistoryPending } from "~/client/@public/ui/HistoryPending";

export const Route = createFileRoute("/$locale/landing")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				ui={{
					layout: "vertical-full",
					width: "full",
					height: "full",
					gap: "xl",
					snap: "vertical",
					snapAlign: "center",
				}}
			>
				<Container
					data-ui={"/landing-[Container]"}
					ui={{
						layout: "vertical-centered",
						flow: "vertical",
						tone: "brand",
						theme: "light",
						background: "alt",
						inner: "xl",
						gap: "xl",
					}}
				>
					<Container
						ui={{
							layout: "horizontal",
							height: "auto",
							width: "full",
						}}
					>
						<Logo />
					</Container>

					<Status
						data-ui="/landing-[Status]"
						textTitle={translator.text("Landing - Hero (title)")}
						messageProps={{
							className: "text-center",
						}}
						ui={{
							tone: "primary",
							theme: "light",
							color: "lead",
						}}
					>
						<Container
							ui={{
								layout: "vertical-flex",
								inner: "4xl",
								gap: "xl",
							}}
						>
							<LinkTo
								{...uiButton({
									ui: {
										tone: "secondary",
										theme: "light",
										size: "default",
										text: "xl",
										justify: "center",
									},
									className: [],
								})}
								icon={ChevronRightIcon}
								iconPosition={"right"}
								iconProps={{
									ui: {
										text: "2xl",
									},
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
								{...uiButton({
									ui: {
										tone: "primary",
										theme: "light",
										size: "default",
										text: "xl",
										justify: "center",
									},
									className: [],
								})}
								icon={ChevronRightIcon}
								iconPosition={"right"}
								iconProps={{
									ui: {
										text: "2xl",
									},
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
					ui={{
						layout: "vertical-centered",
						height: "full",
						width: "full",
					}}
				>
					<Status
						icon={
							<HeroImage
								src={face}
								visible
								ui={{
									tone: "brand",
									theme: "dark",
									border: true,
									shadow: true,
									round: "full",
								}}
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
							ui: {
								color: "text",
							},
						}}
						action={
							<a
								href={"https://github.com/marek-hanzal/zbav-se.me"}
								target={"blank"}
								{...uiLinkTo({
									className: [],
								})}
							>
								<Icon
									icon={GitHubIcon}
									ui={{
										text: "2xl",
									}}
								/>
							</a>
						}
						ui={{
							tone: "brand",
							theme: "light",
							color: "lead",
						}}
					/>
				</Container>

				<Container
					ui={{
						height: "full",
						width: "full",
						inner: "xl",
					}}
				>
					<Suspense fallback={<HistoryPending />}>
						<History _suspense={"I know"} />
					</Suspense>
				</Container>
			</Container>
		);
	},
});
