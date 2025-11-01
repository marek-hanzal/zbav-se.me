import { useParams } from "@tanstack/react-router";
import { LinkTo, type LinkToCls, UserIcon } from "@use-pico/client";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Status } from "@use-pico/client/ui/status";
import { type Cls, tvc } from "@use-pico/cls";
import { Logo, Sheet, UnlockIcon } from "@zbav-se.me/ui";
import type { FC } from "react";

export const HeroSheet: FC = () => {
	const { locale } = useParams({
		from: "/$locale",
	});

	const linkToTweak: Cls.TweaksOf<LinkToCls> = {
		slot: {
			root: {
				class: [
					"block",
					"w-full",
				],
			},
		},
	};

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
				>
					<LinkTo
						to={"/$locale/login"}
						params={{
							locale,
						}}
						tweak={linkToTweak}
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
						tweak={linkToTweak}
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
