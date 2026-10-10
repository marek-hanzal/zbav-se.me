import type { ComponentProps, FC } from "react";
import { uiInputFn } from "~/form/fn/uiInputFn";
import { useTranslator } from "~/translation/hook/useTranslator";

export namespace TextInput {
	export interface Props extends uiInputFn.Component<ComponentProps<"input">> {
		//
	}
}

export const TextInput: FC<TextInput.Props> = ({ placeholder, className, ...props }) => {
	const translator = useTranslator();
	return (
		<input
			type={"text"}
			placeholder={placeholder ? translator.textFn(placeholder) : undefined}
			{...uiInputFn({
				className,
			})}
			{...props}
		/>
	);
};
