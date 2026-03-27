import { WarningIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { useAppForm } from "@zbav-se.me/ui/form";
import { uiWarningStatus } from "@zbav-se.me/ui/ui";
import type { FC } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/client/@common/location/ui/LocationSelect";
import { PersonalSchema } from "~/server/@user/transaction-entry/schema/TransactionEntryCreateSchema/PersonalSchema";

export namespace PersonalControl {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(props: PersonalSchema.Type["payload"]): Promise<any>;
	}
}

export const PersonalControl: FC<PersonalControl.Props> = ({ onCancel, onSave, ui, ...props }) => {
	const form = useAppForm({
		defaultValues: {
			name: "",
			phone: "",
			email: "",
			locationId: "",
		} satisfies PersonalSchema.Type["payload"],
		validators: {
			onMount: PersonalSchema.shape.payload,
			onSubmit: PersonalSchema.shape.payload,
		},
		async onSubmit({ value }) {
			return onSave(value);
		},
	});

	return (
		<form
			data-ui="PersonalControl"
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Container
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
						textTitle={translator.text("Personal - Warning (title)")}
						textMessage={translator.text("Personal - Warning (message)")}
						{...uiWarningStatus({
							className: [
								"text-left",
							],
						})}
					/>

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
				</Container>

				<form.Subscribe
					selector={(state) => ({
						isValid: state.isValid,
						isSubmitting: state.isSubmitting,
					})}
				>
					{({ isValid, isSubmitting }) => (
						<SaveContainer
							onCancel={onCancel}
							onSave={() => {
								form.handleSubmit();
							}}
							loading={isSubmitting}
							disabled={!isValid}
						/>
					)}
				</form.Subscribe>
			</Container>
		</form>
	);
};
