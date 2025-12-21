import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { Logo } from "@zbav-se.me/ui/logo";
import { History } from "~/app/history/History";

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
						textTitle={"Landing - Hero (title)"}
						// textMessage={"Landing - Hero (subtitle)"}
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
								icon={ArrowRightIcon}
								iconPosition={"right"}
								iconProps={{
									ui: {
										text: "2xl",
									},
								}}
								preload={"intent"}
								to={"/$locale/login"}
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
								icon={ArrowRightIcon}
								iconPosition={"right"}
								iconProps={{
									ui: {
										text: "2xl",
									},
								}}
								preload={"intent"}
								to={"/$locale/register"}
								params={{
									locale,
								}}
							>
								<Tx label={"Register (hero)"} />
							</LinkTo>
						</Container>
					</Status>
				</Container>

				{/* <Container
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
						textTitle={"About me (title)"}
						textMessage={"About me (message)"}
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
				</Container>*/}

				<Container
					ui={{
						height: "full",
						width: "full",
						inner: "xl",
					}}
				>
					<History />
				</Container>
			</Container>
		);
	},
});
