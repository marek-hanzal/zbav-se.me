import type { FC } from "react";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Typo } from "~/ui/ui/Typo";

export namespace Tx {
	export interface Props extends Omit<Typo.Props, "label"> {
		label: string | undefined;
		fallback?: string;
	}

	export type PropsEx = Omit<Props, "label">;
}

export const Tx: FC<Tx.Props> = ({ label, fallback, ...props }) => {
	const translator = useTranslator();
	return label ? (
		<Typo
			label={translator.text(label, fallback)}
			{...props}
		/>
	) : null;
};
