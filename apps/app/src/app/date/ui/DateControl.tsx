import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { zTransactionMessageDateCreate } from "@zbav-se.me/sdk/api/user";
import { useAppForm } from "@zbav-se.me/ui/form";
import { DateTime } from "luxon";
import type { FC } from "react";
import type { z } from "zod";
import { SaveControl } from "~/app/control/SaveControl";

// biome-ignore lint/correctness/noUnusedVariables: Ssst
const DateSchema = zTransactionMessageDateCreate.omit({
	transactionId: true,
});
export namespace DateSchema {
	export type Type = z.infer<typeof DateSchema>;
}

export namespace DateControl {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(props: DateSchema.Type): Promise<any>;
		loading: boolean;
	}
}

export const DateControl: FC<DateControl.Props> = ({ onCancel, onSave, loading, ui, ...props }) => {
	const form = useAppForm({
		defaultValues: {
			datetime: DateTime.now().toISO() ?? "",
		} satisfies DateSchema.Type,
		validators: {
			onSubmit: DateSchema,
		},
		async onSubmit({ value }) {
			return onSave(value);
		},
	});

	return (
		<Container
			data-ui="DateControl[Container]"
			ui={{
				layout: "vertical-content-footer",
				height: "full",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-flex",
					height: "auto",
					width: "full",
				}}
			>
				<form
					onSubmit={(e) => {
						e.preventDefault();
						form.handleSubmit();
					}}
				>
					<Container
						ui={{
							layout: "vertical-flex",
							height: "auto",
							width: "full",
							gap: "lg",
						}}
					>
						<form.AppField name={"datetime"}>
							{(field) => (
								<FormField
									id={field.name}
									name={field.name}
									label={<Tx label={"Date - Date and time (label)"} />}
									meta={field.state.meta}
									required
								>
									{(props) => {
										const value = field.state.value
											? DateTime.fromISO(field.state.value).toFormat(
													"yyyy-MM-dd'T'HH:mm",
												)
											: "";

										return (
											<field.TextInput
												type="datetime-local"
												placeholder={translator.text(
													"Date - Date and time (placeholder)",
												)}
												value={value}
												onBlur={field.handleBlur}
												onChange={(e) => {
													const dateTime = DateTime.fromISO(
														e.target.value,
														{
															zone: "local",
														},
													);
													if (dateTime.isValid) {
														field.handleChange(dateTime.toISO() ?? "");
													}
												}}
												{...props}
											/>
										);
									}}
								</FormField>
							)}
						</form.AppField>
					</Container>
				</form>
			</Container>

			<SaveControl
				onCancel={onCancel}
				onSave={() => {
					form.handleSubmit();
				}}
				loading={loading}
				disabled={!form.state.isValid}
			/>
		</Container>
	);
};
