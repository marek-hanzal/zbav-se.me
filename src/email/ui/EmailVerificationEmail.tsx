import { Section } from "@react-email/components";
import type { FC } from "react";
import { MailButton } from "~/email/ui/MailButton";
import { MailCopy } from "~/email/ui/MailCopy";
import { MailLayout } from "~/email/ui/MailLayout";
import { useTranslator } from "~/translation/hook/useTranslator";

export namespace EmailVerificationEmail {
	export interface Props {
		verifyUrl: string;
	}
}

export const EmailVerificationEmail: FC<EmailVerificationEmail.Props> = ({ verifyUrl }) => {
	const translator = useTranslator();

	return (
		<MailLayout
			footer={translator.textFn("Email verification email footer")}
			lead={translator.textFn("Email verification email message")}
			preview={translator.textFn("Email verification email subject")}
			title={translator.textFn("Email verification email title")}
		>
			<Section className={"mt-8"}>
				<MailButton href={verifyUrl}>
					{translator.textFn("Email verification email action")}
				</MailButton>
			</Section>

			<MailCopy
				hint={translator.textFn(
					"If the button does not work, copy this link into your browser:",
				)}
				value={verifyUrl}
			/>
		</MailLayout>
	);
};
