import { Section } from "@react-email/components";
import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { MailButton } from "../ui/MailButton";
import { MailCopy } from "../ui/MailCopy";
import { MailLayout } from "../ui/MailLayout";

export namespace MagicLinkEmail {
	export interface Props {
		signInUrl: string;
	}
}

export const MagicLinkEmail: FC<MagicLinkEmail.Props> = ({ signInUrl }) => {
	const translator = useTranslator();

	return (
		<MailLayout
			footer={translator.text("Magic link email footer")}
			lead={translator.text("Magic link email message")}
			preview={translator.text("Magic link email subject")}
			title={translator.text("Magic link email title")}
		>
			<Section className={"mt-8"}>
				<MailButton href={signInUrl}>
					{translator.text("Magic link email action")}
				</MailButton>
			</Section>

			<MailCopy
				hint={translator.text(
					"If the button does not work, copy this link into your browser:",
				)}
				value={signInUrl}
			/>
		</MailLayout>
	);
};
