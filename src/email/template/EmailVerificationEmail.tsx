import { Section } from "@react-email/components";
import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { MailButton } from "../ui/MailButton";
import { MailCopy } from "../ui/MailCopy";
import { MailLayout } from "../ui/MailLayout";

export namespace EmailVerificationEmail {
	export interface Props {
		verifyUrl: string;
	}
}

export const EmailVerificationEmail: FC<EmailVerificationEmail.Props> = ({ verifyUrl }) => {
	const translator = useTranslator();

	return (
		<MailLayout
			footer={translator.text("Email verification email footer")}
			lead={translator.text("Email verification email message")}
			preview={translator.text("Email verification email subject")}
			title={translator.text("Email verification email title")}
		>
			<Section className={"mt-8"}>
				<MailButton href={verifyUrl}>
					{translator.text("Email verification email action")}
				</MailButton>
			</Section>

			<MailCopy
				hint={translator.text(
					"If the button does not work, copy this link into your browser:",
				)}
				value={verifyUrl}
			/>
		</MailLayout>
	);
};
