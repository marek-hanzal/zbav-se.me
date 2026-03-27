import { ChevronRightIcon } from "@use-pico/client/icon";
import { uiButton } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { useLocale } from "@/lib/client/locale";
import { Logo } from "~/common/ui/logo";

export namespace WelcomePage {
	export interface Props extends Container.Props {}
}

/**
 * Composes the route-level welcome screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the welcome journey.
 *
 * @see apps/app/src/@routes
 */
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
						to={"/$locale/app/home"}
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
