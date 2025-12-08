import { createFormHook, createFormHookContexts } from "@tanstack/react-form";
import { BoolInput } from "@use-pico/client/ui/bool-input";
import { SubmitButton } from "@use-pico/client/ui/submit-button";
import { TextInput } from "@use-pico/client/ui/text-input";

const { fieldContext, formContext } = createFormHookContexts();

export const { useAppForm } = createFormHook({
	fieldComponents: {
		BoolInput,
		TextInput,
	},
	formComponents: {
		SubmitButton,
	},
	fieldContext,
	formContext,
});
