import { createFileRoute } from "@tanstack/react-router";
import { Suspense } from "react";
import { uiButton } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon, GitHubIcon, Icon } from "@/lib/client/icon";
import { LinkTo, uiLinkTo } from "@/lib/client/link-to";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import face from "~/assets/face.webp";
import { HeroImage } from "~/common/ui/img";
import { Logo } from "~/common/ui/logo";
import { History } from "~/public/ui/History";
import { HistoryPending } from "~/public/ui/HistoryPending";

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
