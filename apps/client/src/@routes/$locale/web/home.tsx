import { createFileRoute } from "@tanstack/react-router";
import { Button, Container, LinkTo, Status, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import { useRef } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { anim, useAnim } from "~/app/ui/gsap";
import { Logo } from "~/app/ui/Logo";

export const Route = createFileRoute("/$locale/web/home")({
	component() {
		const { locale } = Route.useParams();

		const pageRef = useRef<HTMLDivElement>(null);

		useAnim(
			() => {
				const elements = anim.utils.toArray<HTMLElement>(
					pageRef.current?.querySelectorAll?.(".reveal") ?? [],
				);
				elements.forEach((el, index) => {
					anim.from(el, {
						opacity: 0,
						y: 48,
						duration: 0.6,
						delay: Math.min(index * 0.05, 0.3),
						scrollTrigger: {
							trigger: el,
							scroller: pageRef.current ?? undefined,
							start: "top 85%",
							end: "bottom 30%",
							toggleActions: "play none none none",
							once: true,
						},
					});
				});
			},
			{
				dependencies: [],
			},
		);

		return (
			<Container
				ref={pageRef}
				layout={"vertical-full"}
				overflow={"vertical"}
				snap={"vertical-start"}
				gap={"md"}
			>
				{/* Hero */}
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

				{/* What we do */}
				<Sheet>
					<div className={"reveal"}>
						<Status
							textTitle={<Tx label={"Landing - What (title)"} />}
							textMessage={<Tx label={"Landing - What (text)"} />}
						/>
					</div>
				</Sheet>

				{/* Features */}
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

				{/* About us */}
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

				{/* Final CTA snap */}
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
