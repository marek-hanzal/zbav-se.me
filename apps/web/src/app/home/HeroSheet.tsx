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
		<Container>
			<div
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
					layout={"horizontal"}
					items={"center"}
					height={"auto"}
					width={"fit"}
				>
					<Logo />
				</Container>

				<Status
					textTitle={"Landing - Hero (title)"}
					textMessage={"Landing - Hero (subtitle)"}
					tweak={{
						slot: {
							body: {
								class: [
									"flex",
									"flex-col",
									"gap-4",
								],
							},
						},
					}}
				>
					<LinkTo
						to={"/$locale/login"}
						params={{
							locale,
						}}
						full
					>
						<Button
							iconEnabled={UnlockIcon}
							iconProps={{
								size: "sm",
							}}
							tone={"secondary"}
							theme={"dark"}
							full
							size={"xl"}
							label={"Login (hero)"}
						/>
					</LinkTo>

					<LinkTo
						to={"/$locale/register"}
						params={{
							locale,
						}}
						full
					>
						<Button
							iconEnabled={UserIcon}
							iconProps={{
								size: "sm",
							}}
							tone={"primary"}
							theme={"dark"}
							full
							size={"xl"}
							label={"Register (hero)"}
						/>
					</LinkTo>
				</Status>
			</div>
		</Container>
	);
};
