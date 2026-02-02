import { WarningIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { zTransactionMessagePersonalCreate } from "@zbav-se.me/sdk/api/user";
import { useAppForm } from "@zbav-se.me/ui/form";
import { uiWarningStatus } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import type { z } from "zod";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
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
				inner: "default",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					scroll: "vertical",
					height: "full",
				}}
			>
				<Status
					icon={WarningIcon}
					textTitle={"Personal - Warning (title)"}
					textMessage={"Personal - Warning (message)"}
					{...uiWarningStatus({
						className: [
							"text-left",
						],
					})}
				/>

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
						}}
					>
						<form.AppField name={"name"}>
							{(field) => (
								<FormField
									id={field.name}
									name={field.name}
									label={<Tx label={"Personal - Name (label)"} />}
									meta={field.state.meta}
									required
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
									required
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
									required
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

						<form.AppField name={"locationId"}>
							{(field) => (
								<FormField
									id={field.name}
									name={field.name}
									label={<Tx label={"Personal - Location (label)"} />}
									meta={field.state.meta}
									required
								>
									{(props) => (
										<LocationSelect
											value={field.state.value ?? null}
											onChange={(value) => {
												field.handleChange(value);
											}}
											textHint={""}
											warningStatusProps={{
												icon: null,
											}}
											{...props}
										/>
									)}
								</FormField>
							)}
						</form.AppField>
					</Container>
				</form>
			</Container>

			<SaveContainer
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
