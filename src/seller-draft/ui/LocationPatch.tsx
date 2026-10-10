import { type FC, useState } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { LocationSelect } from "~/location/ui/LocationSelect";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import type { useView } from "~/view/hook/useView";

const FormSchema = z
	.looseObject({
		locationId: z.string().min(1),
	})
	.strip();

export namespace LocationPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancelFn(): void;
		view: useView.Use<"priceType">;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ draft, onCancelFn, view, ...props }) => {
	const translator = useTranslator();
	const [isSearchPendingSelection, setIsSearchPendingSelectionFn] = useState(false);
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.setFn("priceType");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			locationId: draft.locationId ?? null,
		},
		validators: {
			onMount: FormSchema,
			onChange: FormSchema,
			onBlur: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			return mutation.mutateAsync({
				patch: {
					locationId: value.locationId ?? undefined,
				},
				query: {
					where: {
						id: draft.id,
					},
				},
			});
		},
	});

	return (
		<TitleContainer
			data-ui={"LocationPatch"}
			textTitle={translator.textFn("Location (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
				data-ui-gap="default"
			>
				<form.AppField name={"locationId"}>
					{(field) => (
						<LocationSelect
							textHint={translator.textFn("Location security (hint)")}
							onChangeFn={(value) => {
								field.handleChange(value);
								field.handleBlur();
								setIsSearchPendingSelectionFn(false);
							}}
							onSearchChangeFn={(value) => {
								const hasSearch = Boolean(value?.trim());

								setIsSearchPendingSelectionFn(hasSearch);
								if (hasSearch) {
									field.handleBlur();
								}
							}}
							value={field.state.value}
						/>
					)}
				</form.AppField>

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
							disabled={!isValid || isSearchPendingSelection || isSubmitting}
							textSave={<Tx label={"Continue (label)"} />}
							textCancel={<Tx label={"Back (label)"} />}
							saveProps={{
								iconEnabled: ArrowRightIcon,
								iconPosition: "right",
							}}
						/>
					)}
				</form.Subscribe>
			</Container>
		</TitleContainer>
	);
};
