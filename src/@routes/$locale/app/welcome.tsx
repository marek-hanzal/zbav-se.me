import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { Logo } from "~/application-ui/ui/logo.exports";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ChevronRightIcon } from "~/ui/constant/ChevronRightIcon";
import { uiButton } from "~/ui/fn/uiButton";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Status } from "~/ui/ui/Status";

export const Route = createFileRoute("/$locale/app/welcome")({
	component() {
		const locale = useLocale();
		const translator = useTranslator();
		const actionRef = useRef<HTMLAnchorElement>(null);

		useEffect(() => {
			actionRef?.current?.focus();
		}, []);

		return (
			<Container
				data-ui="Welcome[Container]"
				data-ui-layout="vertical-centered"
				data-ui-height="full"
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
	},
});
