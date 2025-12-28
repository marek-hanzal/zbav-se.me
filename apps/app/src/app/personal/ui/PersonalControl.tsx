import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { zTransactionMessagePersonalCreate } from "@zbav-se.me/sdk/api/user";
import { useAppForm } from "@zbav-se.me/ui/form";
import type { FC } from "react";
import type { z } from "zod";
import { SaveControl } from "~/app/control/SaveControl";
import { LocationSelect } from "~/app/location/ui/LocationSelect";

// biome-ignore lint/correctness/noUnusedVariables: Ssst
const PersonalSchema = zTransactionMessagePersonalCreate.omit({
	transactionId: true,
});
export namespace PersonalSchema {
	export type Type = z.infer<typeof PersonalSchema>;
}

export namespace PersonalControl {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(props: PersonalSchema.Type): Promise<any>;
		loading: boolean;
	}
}

export const PersonalControl: FC<PersonalControl.Props> = ({
	onCancel,
	onSave,
	loading,
	ui,
	...props
}) => {
	const form = useAppForm({
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			locationId: "",
		} satisfies PersonalSchema.Type,
		validators: {
			onSubmit: PersonalSchema,
		},
		async onSubmit({ value }) {
			return onSave(value);
		},
	});

	return (
		<Container
			data-ui="PersonalControl[Container]"
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				...ui,
			}}
			{...props}
		>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<Container
					ui={{
						layout: "vertical-flex",
						gap: "default",
						scroll: "vertical",
						height: "full",
						inner: "default",
					}}
				>
					<form.AppField name={"name"}>
						{(field) => (
							<FormField
								id={field.name}
								name={field.name}
								label={<Tx label={"Name (label)"} />}
								meta={field.state.meta}
								required
							>
								{(props) => (
									<field.TextInput
										placeholder={translator.text("Name (placeholder)")}
										value={field.state.value ?? ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										autoFocus
										{...props}
									/>
								)}
							</FormField>
						)}
					</form.AppField>

					<form.AppField name={"phone"}>
						{(field) => (
							<FormField
								id={field.name}
								name={field.name}
								label={<Tx label={"Phone (label)"} />}
								meta={field.state.meta}
								required
							>
								{(props) => (
									<field.TextInput
										type="tel"
										placeholder={translator.text("Phone (placeholder)")}
										value={field.state.value ?? ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										{...props}
									/>
								)}
							</FormField>
						)}
					</form.AppField>

					<form.AppField name={"email"}>
						{(field) => (
							<FormField
								id={field.name}
								name={field.name}
								label={<Tx label={"Email (label)"} />}
								meta={field.state.meta}
								required
							>
								{(props) => (
									<field.TextInput
										type="email"
										placeholder={translator.text("Email (placeholder)")}
										value={field.state.value ?? ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										{...props}
									/>
								)}
							</FormField>
						)}
					</form.AppField>

					<form.AppField name={"locationId"}>
						{(field) => (
							<FormField
								id={field.name}
								name={field.name}
								label={<Tx label={"Location (label)"} />}
								meta={field.state.meta}
								required
							>
								{(props) => (
									<LocationSelect
										value={field.state.value ?? null}
										onChange={(value) => {
											field.handleChange(value);
										}}
										textHint={translator.text(
											"Message location security (hint)",
										)}
										{...props}
									/>
								)}
							</FormField>
						)}
					</form.AppField>
				</Container>

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						form.handleSubmit();
					}}
					loading={loading}
					disabled={!form.state.isValid}
				/>
			</form>
		</Container>
	);
};
