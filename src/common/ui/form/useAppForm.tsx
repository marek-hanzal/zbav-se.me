import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { SubmitButton } from "@/lib/client/submit";
import { TextInput } from "@/lib/client/text-input";

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
