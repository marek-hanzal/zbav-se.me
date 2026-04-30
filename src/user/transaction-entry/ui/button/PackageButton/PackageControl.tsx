import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { FormField } from "@/lib/client/form";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { useAppForm } from "~/common/ui/form";
import { PackageSchema } from "~/user/transaction-entry/server/schema/TransactionEntryCreateSchema/PackageSchema";

export namespace PackageControl {
	export interface Props extends Container.Props {
		onCancel(): void;
		onSave(props: PackageSchema.Type["payload"]): Promise<any>;
	}
}

export const PackageControl: FC<PackageControl.Props> = ({ onCancel, onSave, ...props }) => {
	const form = useAppForm({
		defaultValues: {
			link: "",
			number: null as string | null,
		} satisfies PackageSchema.Type["payload"],
		validators: {
			onMount: PackageSchema.shape.payload,
			onSubmit: PackageSchema.shape.payload,
		},
		async onSubmit({ value }) {
			return onSave(value);
		},
	});

	return (
		<form
			onSubmit={(e) => {
				e.preventDefault();
				form.handleSubmit();
			}}
		>
			<Container
				data-ui="PackageControl[Container]"
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				{...props}
			>
				<Container
					data-ui-layout="vertical-flex"
					data-ui-height="auto"
					data-ui-width="full"
					data-ui-gap="lg"
				>
					<Container
						data-ui-layout="vertical-flex"
						data-ui-height="auto"
						data-ui-width="full"
						data-ui-gap="lg"
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
											value={field.state.value ?? ""}
											onBlur={field.handleBlur}
											onChange={(e) => field.handleChange(e.target.value)}
											type={"url"}
											placeholder={translator.text(
												"Package - Link (placeholder)",
											)}
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
