import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { BoolInput, Select, SubmitButton, TextInput } from "@use-pico/client";

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldComponents: {
		BoolInput,
		Select,
		TextInput,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
