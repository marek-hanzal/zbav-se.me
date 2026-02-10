import { createFileRoute } from "@tanstack/react-router";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { Logo } from "@zbav-se.me/ui/logo";

export const Route = createFileRoute("/$locale/welcome")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				ui={{
					layout: "vertical-centered",
					height: "full",
				}}
			>
				<Status
					icon={<Logo />}
					textTitle={"Welcome (title)"}
					titleProps={{
						ui: {
							text: "md",
						},
					}}
					action={
						<LinkTo
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to={"/$locale/flow/home"}
							params={{
								locale,
							}}
							{...uiButton({
								ui: {
									tone: "link",
									theme: "light",
									text: "md",
									size: "lg",
								},
								className: [],
							})}
						>
							<Tx label={"Go home (welcome)"} />
						</LinkTo>
					}
					ui={{
						tone: "brand",
						theme: "light",
						inner: "4xl",
					}}
					className={[
						"text-center",
					]}
				/>
			</Container>
		);
	},
});
