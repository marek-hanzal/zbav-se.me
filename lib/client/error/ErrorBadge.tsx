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

export const ErrorBadge: FC<ErrorBadge.Props> = ({ error, placeholder, ...props }) => {
	if (placeholder && !error) {
		return (
			<Badge
				data-ui={"ErrorBadge"}
				data-ui-text="default"
				data-ui-badge="xs"
				data-ui-background={undefined}
				data-ui-shadow={false}
				data-ui-border={false}
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
			data-ui-tone="danger"
			data-ui-text="default"
			data-ui-badge="xs"
			data-ui-color="lead"
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
