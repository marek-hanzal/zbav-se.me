import type { FC } from "react";
import z from "zod";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { cleanOf } from "@/lib/common/clean-of";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { useAppForm } from "~/common/ui/form";
import type { PersonalSchema } from "~/user/transaction-entry/server/schema/TransactionEntryCreateSchema/PersonalSchema";

const Schema = z
	.looseObject({
		name: z.string().min(0),
		phone: z.string().min(0),
		email: z.union([
			z.literal(""),
			z.email(),
		]),
	})
	.strip();

type Schema = typeof Schema;

namespace Schema {
	export type Type = z.infer<Schema>;
}

export namespace PersonalControl {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(props: PersonalSchema.Type["payload"]): Promise<any>;
	}
}

export const PersonalControl: FC<PersonalControl.Props> = ({ onCancel, onSave, ...props }) => {
	const translator = useTranslator();
	const form = useAppForm({
		defaultValues: {
			name: "",
			phone: "",
			email: "",
		} satisfies Schema.Type,
		validators: {
			onMount: Schema,
			onSubmit: Schema,
		},
		async onSubmit({ value }) {
			return onSave(cleanOf(value) || {});
		},
	});

	return (
		<Container
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-inner="default"
			{...props}
		>
			<Container
				data-ui-scroll="vertical"
				data-ui-height="full"
			>
				<Container
					data-ui-layout="vertical-flex"
					data-ui-gap="default"
				>
					<form.AppField name={"name"}>
						{(field) => (
							<FormField
								id={field.name}
								name={field.name}
								label={<Tx label={"Personal - Name (label)"} />}
								meta={field.state.meta}
							>
								{(props) => (
									<field.TextInput
										placeholder={translator.text(
											"Personal - Name (placeholder)",
										)}
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
								label={<Tx label={"Personal - Phone (label)"} />}
								meta={field.state.meta}
							>
								{(props) => (
									<field.TextInput
										type="tel"
										placeholder={translator.text(
											"Personal - Phone (placeholder)",
										)}
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
								label={<Tx label={"Personal - Email (label)"} />}
								meta={field.state.meta}
							>
								{(props) => (
									<field.TextInput
										type="email"
										placeholder={translator.text(
											"Personal - Email (placeholder)",
										)}
										value={field.state.value ?? ""}
										onBlur={field.handleBlur}
										onChange={(e) => field.handleChange(e.target.value)}
										{...props}
									/>
								)}
							</FormField>
						)}
					</form.AppField>
				</Container>
			</Container>

			<form.Subscribe
				selector={(state) => ({
					values: state.values,
					isValid: state.isValid,
					isSubmitting: state.isSubmitting,
				})}
			>
				{({ values, isValid, isSubmitting }) => {
					const hasNonEmpty = !!(values.name || values.phone || values.email);

					return (
						<SaveContainer
							onCancel={onCancel}
							onSave={() => {
								form.handleSubmit();
							}}
							loading={isSubmitting}
							disabled={!isValid || !hasNonEmpty}
						/>
					);
				}}
			</form.Subscribe>
		</Container>
	);
};
