import type { FC } from "react";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { FormField } from "~/form/ui/FormField";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { Container } from "~/ui/ui/Container";
import { PackageSchema } from "~/user-transaction-entry/schema/TransactionEntryCreatePackageSchema";

export namespace PackageControl {
	export interface Props extends Container.Props {
		onCancelFn(): void;
		onSaveFn(props: PackageSchema.Type["payload"]): Promise<any>;
	}
}

export const PackageControl: FC<PackageControl.Props> = ({ onCancelFn, onSaveFn, ...props }) => {
	const translator = useTranslator();
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
			return onSaveFn(value);
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
											placeholder={translator.textFn(
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
											placeholder={translator.textFn(
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
							onCancelFn={onCancelFn}
							onSaveFn={() => {
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
