import { Section } from "@react-email/components";
import type { FC } from "react";
import { MailButton } from "~/email/ui/MailButton";
import { MailCopy } from "~/email/ui/MailCopy";
import { MailLayout } from "~/email/ui/MailLayout";
import { useTranslator } from "~/translation/hook/useTranslator";

export namespace PasswordResetEmail {
	export interface Props {
		resetUrl: string;
	}
}

export const PasswordResetEmail: FC<PasswordResetEmail.Props> = ({ resetUrl }) => {
	const translator = useTranslator();

	return (
		<MailLayout
			footer={translator.text("Password reset email footer")}
			lead={translator.text("Password reset email message")}
			preview={translator.text("Password reset email subject")}
			title={translator.text("Password reset email title")}
		>
			<Section className={"mt-8"}>
				<MailButton href={resetUrl}>
					{translator.text("Password reset email action")}
				</MailButton>
			</Section>

			<MailCopy
				hint={translator.text(
					"If the button does not work, copy this link into your browser:",
				)}
				value={resetUrl}
			/>
		</MailLayout>
	);
};
