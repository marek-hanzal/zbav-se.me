import { UserIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { tvc } from "@use-pico/cls";
import { UnlockIcon } from "@zbav-se.me/ui/icon";
import { Logo } from "@zbav-se.me/ui/logo";
import type { FC } from "react";

export namespace HeroSheet {
	export interface Props {
		locale: string;
	}
}

export const HeroSheet: FC<HeroSheet.Props> = ({ locale }) => {
	return (
		<Container data-ui={"HeroSheet"}>
			<div
				data-ui={"HeroSheet-wrapper"}
				className={tvc([
					"flex",
					"flex-col",
					"justify-evenly",
					"h-dvh",
					"py-16",
					"px-4",
				])}
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
					data-ui="HeroSheet-Status"
					textTitle={"Landing - Hero (title)"}
					textMessage={"Landing - Hero (subtitle)"}
				>
					<LinkTo
						to={"/$locale/login"}
						params={{
							locale,
						}}
					>
						<Button
							iconEnabled={UnlockIcon}
							iconProps={{
								ui: {
									size: "sm",
								},
							}}
							label={"Login (hero)"}
							ui={{
								size: "xl",
								tone: "secondary",
								theme: "dark",
							}}
						/>
					</LinkTo>

					<LinkTo
						to={"/$locale/register"}
						params={{
							locale,
						}}
					>
						<Button
							iconEnabled={UserIcon}
							iconProps={{
								ui: {
									size: "sm",
								},
							}}
							label={"Register (hero)"}
							ui={{
								size: "xl",
								tone: "primary",
								theme: "dark",
							}}
						/>
					</LinkTo>
				</Status>
			</div>
		</Container>
	);
};
