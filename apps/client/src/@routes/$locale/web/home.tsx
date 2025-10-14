import { createFileRoute } from "@tanstack/react-router";
import { Button, Container, LinkTo, Status, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import { useRef } from "react";
import { useEnterAnim } from "~/app/home/useEnterAnim";
import { Sheet } from "~/app/sheet/Sheet";
import { Logo } from "~/app/ui/Logo";

export const Route = createFileRoute("/$locale/web/home")({
	component() {
		const { locale } = Route.useParams();

		const scrollerRef = useRef<HTMLDivElement>(null);

		useEnterAnim(scrollerRef);

		return (
			<Container
				ref={scrollerRef}
				layout={"vertical-full"}
				overflow={"vertical"}
				snap={"vertical-start"}
				gap={"md"}
			>
				<Sheet>
					<div className={"reveal"}>
						<Status
							icon={<Logo />}
							textTitle={<Tx label={"Landing - Hero (title)"} />}
							textMessage={
								<Tx label={"Landing - Hero (subtitle)"} />
							}
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
					</div>
				</Sheet>

				<Sheet>
					<div className={"reveal"}>
						<Status
							textTitle={<Tx label={"Landing - What (title)"} />}
							textMessage={<Tx label={"Landing - What (text)"} />}
						/>
					</div>
				</Sheet>

				<Sheet>
					<div
						className={tvc([
							"grid",
							"grid-cols-1 md:grid-cols-3",
							"gap-3",
						])}
					>
						<div className={"reveal"}>
							<Status
								textTitle={
									<Tx label={"Landing - Feature 1 (title)"} />
								}
								textMessage={
									<Tx label={"Landing - Feature 1 (text)"} />
								}
							/>
						</div>
						<div className={"reveal"}>
							<Status
								textTitle={
									<Tx label={"Landing - Feature 2 (title)"} />
								}
								textMessage={
									<Tx label={"Landing - Feature 2 (text)"} />
								}
							/>
						</div>
						<div className={"reveal"}>
							<Status
								textTitle={
									<Tx label={"Landing - Feature 3 (title)"} />
								}
								textMessage={
									<Tx label={"Landing - Feature 3 (text)"} />
								}
							/>
						</div>
					</div>
				</Sheet>

				<Sheet>
					<div className={"reveal"}>
						<Status
							textTitle={<Tx label={"Landing - About (title)"} />}
							textMessage={
								<Tx label={"Landing - About (text)"} />
							}
						/>
					</div>
				</Sheet>

				<Sheet>
					<div className={"reveal"}>
						<Status
							textTitle={<Tx label={"Landing - CTA (title)"} />}
							textMessage={<Tx label={"Landing - CTA (text)"} />}
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
					</div>
				</Sheet>
			</Container>
		);
	},
});
