import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { Logo } from "~/common/ui/logo";

export namespace ForgotPasswordSentPage {
	export interface Props extends Container.Props {
		//
	}
}

export const ForgotPasswordSentPage: FC<ForgotPasswordSentPage.Props> = ({ ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();

	return (
		<Container
			data-ui="ForgotPasswordSentPage"
			data-ui-layout="vertical-centered"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			{...props}
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
					textTitle={translator.text("Reset your password")}
					textMessage={translator.text("Check your email for the reset link.")}
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
};
