import type { ComponentProps, FC } from "react";
import { uiInput } from "~/form/fn/uiInput";
import { useTranslator } from "~/translation/hook/useTranslator";

export namespace TextInput {
	export interface Props extends uiInput.Component<ComponentProps<"input">> {
		//
	}
}

export const TextInput: FC<TextInput.Props> = ({ placeholder, className, ...props }) => {
	const translator = useTranslator();
	return (
		<input
			type={"text"}
			placeholder={placeholder ? translator.text(placeholder) : undefined}
			{...uiInput({
				className,
			})}
			{...props}
		/>
	);
};
