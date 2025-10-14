import { createFileRoute } from "@tanstack/react-router";
import { Button, Container, LinkTo, Status, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import { Sheet } from "~/app/sheet/Sheet";
import { Logo } from "~/app/ui/Logo";

export const Route = createFileRoute("/$locale/web/home")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				layout={"vertical-full"}
				overflow={"vertical"}
				snap={"vertical-start"}
				gap={"md"}
			>
				<Sheet>
					<Status
						icon={<Logo />}
						textTitle={<Tx label={"Welcome (title)"} />}
						tweak={{
							slot: {
								body: {
									class: [
										"w-full",
									],
								},
							},
						}}
					>
						<div
							className={tvc([
								"inline-flex",
								"flex-row",
								"gap-2",
								"items-center",
								"justify-center",
								"w-full",
							])}
						>
							<Button
								tone={"secondary"}
								theme={"dark"}
							>
								<LinkTo
									to={"/$locale/login"}
									params={{
										locale,
									}}
								>
									<Tx label={"Login"} />
								</LinkTo>
							</Button>

							<Button
								tone={"primary"}
								theme={"dark"}
							>
								<LinkTo
									to={"/$locale/register"}
									params={{
										locale,
									}}
								>
									<Tx label={"Register"} />
								</LinkTo>
							</Button>
						</div>
					</Status>
				</Sheet>

				<Sheet>Another shit</Sheet>
			</Container>
		);
	},
});
