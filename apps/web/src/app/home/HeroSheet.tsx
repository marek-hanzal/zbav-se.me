import { useParams } from "@tanstack/react-router";
import { Button, LinkTo, Status, UserIcon } from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import { Logo, Sheet, UnlockIcon } from "@zbav-se.me/ui";
import type { FC } from "react";

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
					"flex-col",
					"justify-evenly",
					"h-dvh",
					"py-16",
					"px-4",
					"opacity-0",
				])}
			>
				<div className="flex justify-center">
					<Logo />
				</div>

				<Status
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
		</Sheet>
	);
};
