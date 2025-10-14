import { useParams } from "@tanstack/react-router";
import { Button, LinkTo, Status, Tx, UserIcon } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";
import { Sheet } from "~/app/sheet/Sheet";

export const CtaSheet: FC = () => {
	const { locale } = useParams({
		from: "/$locale",
	});

	return (
		<Sheet>
			<div className={"reveal"}>
				<Status
					icon={"icon-[mingcute--celebrate-line]"}
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
							tone={"primary"}
							theme={"dark"}
							iconEnabled={UserIcon}
							iconProps={{
								size: "md",
							}}
							size={"xl"}
						>
							<LinkTo
								to={"/$locale/register"}
								params={{
									locale,
								}}
							>
								<Tx label={"Register (cta)"} />
							</LinkTo>
						</Button>
					</div>
				</Status>
			</div>
		</Sheet>
	);
};
