import { Button } from "@react-email/components";
import type { CSSProperties, FC } from "react";
import { theme } from "../theme/theme";

export namespace MailButton {
	export interface Props {
		children: string;
		href: string;
		style?: CSSProperties;
	}
}

export const MailButton: FC<MailButton.Props> = ({ children, href, style }) => {
	return (
		<Button
			className={
				"rounded-full bg-brand-700 px-6 py-3 text-base font-bold text-white no-underline"
			}
			href={href}
			style={{
				backgroundColor: theme.colors.primary,
				color: theme.colors.primaryText,
				...style,
			}}
		>
			{children}
		</Button>
	);
};
