import { Container } from "@use-pico/client/ui/container";
import { FormField } from "@use-pico/client/ui/form";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { zTransactionMessagePackageCreate } from "@zbav-se.me/sdk/api/user";
import { useAppForm } from "@zbav-se.me/ui/form";
import type { FC } from "react";
import type { z } from "zod";
import { SaveControl } from "~/app/control/SaveControl";

// biome-ignore lint/correctness/noUnusedVariables: Ssst
const PackageSchema = zTransactionMessagePackageCreate.omit({
	transactionId: true,
});
export namespace PackageSchema {
	export type Type = z.infer<typeof PackageSchema>;
}

export namespace PackageControl {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(props: PackageSchema.Type): Promise<any>;
		loading: boolean;
	}
}

export const PackageControl: FC<PackageControl.Props> = ({
	onCancel,
	onSave,
	loading,
	ui,
	...props
}) => {
	const form = useAppForm({
		defaultValues: {
			link: "",
			number: null as string | null,
		} satisfies PackageSchema.Type,
		validators: {
			onSubmit: PackageSchema,
		},
		async onSubmit({ value }) {
			return onSave(value);
		},
	});

	return (
		<Container
			data-ui="PackageControl[Container]"
			ui={{
				layout: "vertical-flex",
				height: "auto",
				width: "full",
				gap: "lg",
				...ui,
			}}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-flex",
					height: "auto",
					width: "full",
					gap: "lg",
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
						<form.AppField name={"link"}>
							{(field) => (
								<FormField
									id={field.name}
									name={field.name}
									label={<Tx label={"Package - Link (label)"} />}
									meta={field.state.meta}
									required
								>
									{(props) => (
										<field.TextInput
											type="url"
											placeholder={translator.text(
												"Package - Link (placeholder)",
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

						<form.AppField name={"number"}>
							{(field) => (
								<FormField
									id={field.name}
									name={field.name}
									label={<Tx label={"Package - Tracking number (label)"} />}
									meta={field.state.meta}
								>
									{(props) => (
										<field.TextInput
											placeholder={translator.text(
												"Package - Tracking number (placeholder)",
											)}
											value={field.state.value ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) => {
												const value = e.target.value;
												field.handleChange(value === "" ? null : value);
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
