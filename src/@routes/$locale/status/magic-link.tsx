import { createFileRoute } from "@tanstack/react-router";
import { Logo } from "~/common/ui/logo";
import { useLocale } from "~/locale/hook/useLocale";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { LinkTo } from "~/ui/ui/LinkTo";
import { Status } from "~/ui/ui/Status";

export const Route = createFileRoute("/$locale/status/magic-link")({
	component() {
		const locale = useLocale();
		const translator = useTranslator();

		return (
			<Container
				data-ui="MagicLinkSent[Container]"
				data-ui-layout="vertical-centered"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
			>
				<Container
					data-ui-layout="vertical-flex"
					data-ui-scroll="vertical"
					data-ui-width="full"
					data-ui-height="content"
				>
					<Status
						icon={
							<LinkTo
								to={"/$locale/landing"}
								params={{
									locale,
								}}
							>
								<Logo />
							</LinkTo>
						}
						textTitle={translator.text("Magic link sent")}
						textMessage={translator.text("Check your email for the sign-in link.")}
						data-ui-inner="default"
					>
						<Container
							data-ui-layout="vertical-flex"
							data-ui-width="full"
							data-ui-items="center"
							data-ui-gap="lg"
						>
							<LinkTo
								to={"/$locale/sign-in"}
								params={{
									locale,
								}}
							>
								<Tx
									label={"Back to sign in"}
									data-ui-tone="link"
									data-ui-theme="light"
									data-ui-text="md"
									data-ui-color="lead"
								/>
							</LinkTo>
						</Container>
					</Status>
				</Container>
			</Container>
		);
	},
});
