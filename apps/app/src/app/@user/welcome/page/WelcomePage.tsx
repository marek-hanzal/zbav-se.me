import { useLocale } from "@use-pico/client/hook";
import { ChevronRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { Logo } from "@zbav-se.me/ui/logo";
import type { FC } from "react";

export namespace WelcomePage {
	export interface Props extends Container.Props {}
}

export const WelcomePage: FC<WelcomePage.Props> = ({ ui, ...props }) => {
	const locale = useLocale();

	return (
		<Container
			ui={{
				layout: "vertical-centered",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<Status
				icon={<Logo />}
				textTitle={translator.text("Welcome (title)")}
				titleProps={{
					ui: {
						text: "md",
					},
				}}
				action={
					<LinkTo
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/home"}
						params={{
							locale,
						}}
						{...uiButton({
							ui: {
								tone: "link",
								theme: "light",
								text: "md",
								size: "lg",
							},
							className: [],
						})}
					>
						<Tx label={"Go home (welcome)"} />
					</LinkTo>
				}
				ui={{
					tone: "brand",
					theme: "light",
					inner: "4xl",
				}}
				className={[
					"text-center",
				]}
			/>
		</Container>
	);
};
