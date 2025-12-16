import { createFileRoute } from "@tanstack/react-router";
import { ArrowRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { Logo } from "@zbav-se.me/ui/logo";

export const Route = createFileRoute("/$locale/landing")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				data-ui={"/landing-[Container]"}
				ui={{
					layout: "vertical-centered",
					flow: "vertical",
					height: "full",
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
					textMessage={"Landing - Hero (subtitle)"}
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
		);
	},
});
