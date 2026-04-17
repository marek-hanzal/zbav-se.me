import type { FC } from "react";
import { Badge } from "@/lib/client/badge";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { TypoIcon } from "~/common/ui/typo";

export namespace ErrorBadge {
	export interface Props extends Badge.Props {
		error: Error | null | undefined;
		/**
		 * Keep the error in place (preserve space) even without error (invisible)
		 */
		placeholder?: boolean;
	}
}

export const ErrorBadge: FC<ErrorBadge.Props> = ({ error, placeholder, ui, ...props }) => {
	if (placeholder && !error) {
		return (
			<Badge
				data-ui={"ErrorBadge"}
				ui={{
					text: "default",
					badge: "xs",
					background: undefined,
					shadow: false,
					border: false,
					...ui,
				}}
				{...props}
			>
				&nbsp;
			</Badge>
		);
	}
	if (!placeholder && !error) {
		return null;
	}

	return (
		<Badge
			data-ui={"ErrorBadge"}
			ui={{
				tone: "danger",
				text: "default",
				badge: "xs",
				color: "lead",
				...ui,
			}}
			{...props}
		>
			<TypoIcon icon={"icon-[solar--adhesive-plaster-linear]"}>
				<Tx
					label={error?.message}
					fallback={translator.text("Something went wrong (error)")}
				/>
			</TypoIcon>
		</Badge>
	);
};
