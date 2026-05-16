import type { FC } from "react";
import { useTranslator } from "@/lib/client/translation";

export namespace PasswordResetEmail {
	export interface Props {
		resetUrl: string;
	}
}

export const PasswordResetEmail: FC<PasswordResetEmail.Props> = ({ resetUrl }) => {
	const translator = useTranslator();

	return (
		<div>
			<h1>{translator.text("Password reset email title")}</h1>
			<p>{translator.text("Password reset email message")}</p>
			<p>
				<a href={resetUrl}>{translator.text("Password reset email action")}</a>
			</p>
			<p>{translator.text("Password reset email footer")}</p>
		</div>
	);
};
