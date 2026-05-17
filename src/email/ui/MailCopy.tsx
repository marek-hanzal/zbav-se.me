import { Link, Text } from "@react-email/components";
import type { FC } from "react";
import { theme } from "../theme/theme";

export namespace MailCopy {
	export interface Props {
		hint: string;
		value: string;
	}
}

export const MailCopy: FC<MailCopy.Props> = ({ hint, value }) => {
	return (
		<>
			<Text
				className={"m-0 mt-6 text-sm leading-6 text-slate-500"}
				style={{
					color: theme.colors.textSoft,
				}}
			>
				{hint}
			</Text>

			<Link
				className={"mt-2 block break-all text-sm leading-6 text-brand-700 underline"}
				href={value}
				style={{
					color: theme.colors.primary,
				}}
			>
				{value}
			</Link>
		</>
	);
};
