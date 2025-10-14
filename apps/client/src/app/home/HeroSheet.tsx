import { useParams } from "@tanstack/react-router";
import { Button, LinkTo, Status, Tx } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { Logo } from "~/app/ui/Logo";

export const HeroSheet: FC = () => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<Sheet>
			<div
				className={tvc([
					"reveal",
					"flex",
					"items-center",
					"justify-center",
					"relative",
				])}
			>
				<div
					className={tvc([
						"pointer-events-none",
						"absolute",
						"inset-0",
						"-z-10",
					])}
				>
					<div
						className={tvc([
							"absolute",
							"-top-24",
							"right-[-10%]",
							"h-[36rem]",
							"w-[36rem]",
							"rounded-full",
							"bg-gradient-to-br",
							"from-indigo-500/20",
							"to-cyan-500/10",
							"blur-2xl",
						])}
					/>
					<div
						className={tvc([
							"absolute",
							"-bottom-16",
							"left-[-10%]",
							"h-[28rem]",
							"w-[28rem]",
							"rounded-full",
							"bg-gradient-to-tr",
							"from-fuchsia-500/10",
							"to-purple-500/10",
							"blur-2xl",
						])}
					/>
				</div>

				<Status
					icon={<Logo />}
					textTitle={<Tx label={"Landing - Hero (title)"} />}
					textMessage={<Tx label={"Landing - Hero (subtitle)"} />}
					tweak={{
						slot: {
							body: {
								class: [
									"w-full",
									"max-w-screen-md",
									"text-center",
									"mx-auto",
									"px-4",
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
							"mt-2",
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
	);
};
