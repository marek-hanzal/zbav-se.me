import type { ComponentProps, FC } from "react";
import { useTranslator } from "@/lib/client/translation";
import { uiInput } from "../form/uiInput";

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
