import { UserIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
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
		<Container
			data-ui={"HeroSheet[Container]"}
			ui={{
				layout: "vertical-centered",
				flow: "vertical",
				height: "full",
				tone: "brand",
				theme: "light",
				background: "alt",
				inner: "xl",
				gap: "xl",
			}}
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
				messageProps={{
					className: [
						"text-center",
					],
				}}
				ui={{
					tone: "primary",
					theme: "light",
					color: "lead",
				}}
			>
				<Container
					ui={{
						layout: "vertical-flex",
						inner: "4xl",
						gap: "xl",
					}}
				>
					<LinkTo
						{...uiButton({
							ui: {
								tone: "secondary",
								theme: "light",
								size: "default",
								text: "xl",
								justify: "center",
							},
							className: [],
						})}
						icon={UnlockIcon}
						iconProps={{
							ui: {
								text: "2xl",
							},
						}}
						to={"/$locale/login"}
						params={{
							locale,
						}}
					>
						<Tx label={"Login (hero)"} />
					</LinkTo>

					<LinkTo
						{...uiButton({
							ui: {
								tone: "primary",
								theme: "light",
								size: "default",
								text: "xl",
								justify: "center",
							},
							className: [],
						})}
						icon={UserIcon}
						iconProps={{
							ui: {
								text: "2xl",
							},
						}}
						to={"/$locale/register"}
						params={{
							locale,
						}}
					>
						<Tx label={"Register (hero)"} />
					</LinkTo>
				</Container>
			</Status>
		</Container>
	);
};
