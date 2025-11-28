import { UserIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";

export namespace CtaSheet {
	export interface Props {
		locale: string;
	}
}

export const CtaSheet: FC<CtaSheet.Props> = ({ locale }) => {
	return (
		<Container
			layout={"vertical-centered"}
			items={"center"}
			className={"reveal"}
		>
			<Status
				icon={"icon-[mingcute--celebrate-line]"}
				textTitle={"Landing - CTA (title)"}
				textMessage={"Landing - CTA (text)"}
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
					<LinkTo
						to={"/$locale/register"}
						params={{
							locale,
						}}
					>
						<Button
							tone={"primary"}
							theme={"dark"}
							iconEnabled={UserIcon}
							iconProps={{
								size: "md",
							}}
							size={"xl"}
							label={"Register (cta)"}
						/>
					</LinkTo>
				</div>
			</Status>
		</Container>
	);
};
