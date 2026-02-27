import { LabelValue } from "@use-pico/client/ui/container";
import { translator } from "@use-pico/common/translator";
import type { FC } from "react";

export namespace ExpireAtValue {
	export interface Props extends LabelValue.PropsEx {
		expiresAt: string | number | Date | null | undefined;
	}
}

export const ExpireAtValue: FC<ExpireAtValue.Props> = ({ expiresAt, ...props }) => {
	const hasExpiresAt = expiresAt != null;
	return (
		<LabelValue
			data-ui={"ExpireAtValue[LabelValue]"}
			textLabel={translator.text("Expire (title)")}
			textValue={hasExpiresAt ? translator.text(`Expire in ${expiresAt}`) : null}
			textEmpty={translator.text("Expiration date not set")}
			textHint={translator.text("Draft expire (hint)")}
			{...props}
		/>
	);
};
