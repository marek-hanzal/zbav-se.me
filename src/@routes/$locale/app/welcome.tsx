import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import { uiButton } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { Logo } from "~/common/ui/logo";

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
