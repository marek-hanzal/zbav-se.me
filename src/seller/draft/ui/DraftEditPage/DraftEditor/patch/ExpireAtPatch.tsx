import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Mx } from "@/lib/client/mx";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { ExpireAtSelect } from "~/common/expire-at/ui/ExpireAtSelect";
import type { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const ExpireAtSchema = ListingCreateSchema.pick({
	expiresAt: true,
});

export namespace ExpireAtPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const ExpireAtPatch: FC<ExpireAtPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			expiresAt: (draft.expiresAt as ListingExpireEnumSchema.Type | null) ?? null,
		},
		validators: {
			onMount: ExpireAtSchema,
			onChange: ExpireAtSchema,
			onBlur: ExpireAtSchema,
			onSubmit: ExpireAtSchema,
		},
		async onSubmit({ value }) {
			mutation.mutate({
				patch: {
					expiresAt: value.expiresAt,
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
			textTitle={translator.text("Expire (title)")}
			data-ui={"Setup-[TitleContainer.expire-at]"}
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
				<form.AppField name={"expiresAt"}>
					{(field) => (
						<Container>
							<ExpireAtSelect
								value={field.state.value ?? undefined}
								onChange={(value) => {
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

				<form.Subscribe selector={(state) => state.isValid}>
					{(isValid) => (
						<SaveContainer
							onCancel={onCancel}
							onSave={() => {
								form.handleSubmit();
							}}
							loading={mutation.isPending}
							disabled={!isValid || mutation.isPending}
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
