import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { SubmitButton } from "~/form/ui/SubmitButton";
import { TextInput } from "~/ui/ui/TextInput";

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldComponents: {
		TextInput,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
