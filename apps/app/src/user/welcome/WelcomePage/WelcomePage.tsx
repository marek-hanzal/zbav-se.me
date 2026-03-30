import { LinkTo } from "@use-pico/client/ui/link-to";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";
import { uiButton } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
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
