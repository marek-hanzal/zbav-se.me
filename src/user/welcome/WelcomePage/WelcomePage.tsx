import { type FC, useEffect, useRef } from "react";
import { uiButton } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { Logo } from "~/common/ui/logo";

export namespace WelcomePage {
	export interface Props extends Container.Props {
		//
	}
}

/**
 * Composes the route-level welcome screen and arranges the main page structure for this flow.
 * Use it from route definitions as the primary UI boundary for the welcome journey.
 *
 * @see src/@routes
 */
export const WelcomePage: FC<WelcomePage.Props> = ({ ...props }) => {
	const locale = useLocale();
	const actionRef = useRef<HTMLAnchorElement>(null);

	useEffect(() => {
		actionRef?.current?.focus();
	}, []);

	return (
		<Container
			data-ui="WelcomePage"
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			{...props}
		>
			<Status
				icon={<Logo />}
				textTitle={translator.text("Welcome (title)")}
				titleProps={{
					"data-ui-text": "md",
				}}
				action={
					<LinkTo
						ref={actionRef}
						data-action={"go home from welcome"}
						icon={ChevronRightIcon}
						iconPosition={"right"}
						to={"/$locale/app/home"}
						params={{
							locale,
						}}
						{...uiButton({
							"data-ui-tone": "link",
							"data-ui-theme": "light",
							"data-ui-text": "md",
							"data-ui-size": "lg",
						})}
					>
						<Tx label={"Go home (welcome)"} />
					</LinkTo>
				}
				data-ui-tone="brand"
				data-ui-theme="light"
				data-ui-inner="4xl"
				className={[
					"text-center",
				]}
			/>
		</Container>
	);
};
