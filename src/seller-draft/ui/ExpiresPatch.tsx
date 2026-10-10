import type { FC } from "react";
import { z } from "zod";
import { useAppForm } from "~/application-ui/hook/form.exports";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { ExpireAtSelect } from "~/expire-at/ui/ExpireAtSelect/index";
import { ListingExpireEnumSchema } from "~/listing/schema/ListingExpireEnumSchema";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Mx } from "~/translation/ui/Mx";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import type { useView } from "~/view/hook/useView";

const FormSchema = z
	.looseObject({
		expires: ListingExpireEnumSchema,
	})
	.strip();

export namespace ExpiresPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancelFn(): void;
		view: useView.Use<"default">;
	}
}

export const ExpiresPatch: FC<ExpiresPatch.Props> = ({ draft, onCancelFn, view, ...props }) => {
	const translator = useTranslator();
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.setFn("default");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			expires: draft.expires,
		},
		validators: {
			onMount: FormSchema,
			onChange: FormSchema,
			onBlur: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			if (!value.expires) {
				return;
			}

			return mutation.mutateAsync({
				patch: {
					expires: value.expires,
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
			data-ui={"ExpireAtPatch"}
			textTitle={translator.textFn("Expire (title)")}
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
				<form.AppField name={"expires"}>
					{(field) => (
						<Container>
							<ExpireAtSelect
								value={field.state.value ?? undefined}
								onChangeFn={(value) => {
									field.handleChange(value);
									field.handleBlur();
								}}
							/>

							<Mx
								label={"Listing expiration (hint)"}
								data-ui-tone="neutral"
								data-ui-theme="light"
								data-ui-inner="default"
								data-ui-color="lead"
								data-ui-opacity="7"
							/>
						</Container>
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
							disabled={!isValid || isSubmitting}
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
