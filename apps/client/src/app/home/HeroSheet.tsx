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
			<div className={"reveal"}>
				<Status
					icon={<Logo />}
					textTitle={<Tx label={"Landing - Hero (title)"} />}
					textMessage={<Tx label={"Landing - Hero (subtitle)"} />}
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
	);
};
