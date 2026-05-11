import type { FC } from "react";

export namespace PasswordResetEmail {
	export interface Props {
		resetUrl: string;
	}
}

export const PasswordResetEmail: FC<PasswordResetEmail.Props> = ({ resetUrl }) => {
	return (
		<div>
			<h1>Reset your password</h1>
			<p>We received a request to reset your password.</p>
			<p>
				<a href={resetUrl}>Open password reset</a>
			</p>
			<p>If you did not request this change, you can safely ignore this email.</p>
		</div>
	);
};
