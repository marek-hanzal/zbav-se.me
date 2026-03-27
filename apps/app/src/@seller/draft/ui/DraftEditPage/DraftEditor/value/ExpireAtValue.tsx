import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace ExpireAtValue {
	export interface Props extends LabelValue.PropsEx {
		expiresAt: string | number | Date | null | undefined;
	}
}

/**
 * Renders a read-only expire at value with consistent formatting and empty-state handling.
 * Use it in detail cards, summaries, and previews where editable controls are not needed.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const ExpireAtValue: FC<ExpireAtValue.Props> = ({ expiresAt, ...props }) => {
	const hasExpiresAt = expiresAt != null;
	return (
		<LabelValue
			data-ui={"ExpireAtValue"}
			textLabel={translator.text("Expire (title)")}
			textValue={hasExpiresAt ? translator.text(`Expire in ${expiresAt}`) : null}
			textEmpty={translator.text("Expiration date not set")}
			textHint={translator.text("Draft expire (hint)")}
			{...props}
		/>
	);
};
