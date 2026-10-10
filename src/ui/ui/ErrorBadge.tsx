import type { FC } from "react";
import { TypoIcon } from "~/application-ui/ui/typo.exports";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Badge } from "~/ui/ui/Badge";

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
	const translator = useTranslator();
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
			data-ui-width="full"
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
