import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { SubmitButton, TextInput } from "@/lib/client/form";

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
