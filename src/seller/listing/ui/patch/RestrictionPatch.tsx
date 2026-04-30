import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import type { EntitySchema } from "@/lib/common/schema";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { RestrictionEnumSchema } from "~/common/restriction/enum/RestrictionEnumSchema";
import { RestrictionSelect } from "~/common/restriction/ui/RestrictionSelect";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

const FormSchema = z
	.looseObject({
		restriction: RestrictionEnumSchema.nullable(),
	})
	.strip();

export namespace RestrictionPatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		view: useView.Use<"default">;
	}
}

export const RestrictionPatch: FC<RestrictionPatch.Props> = ({
	listing,
	onCancel,
	view,
	...props
}) => {
	const mutation = withListingQuery.usePatchMutation({
		onSuccess() {
			view.set("default");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			restriction: listing.restriction,
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
					restriction: value.restriction,
				},
				query: {
					where: {
						id: listing.id,
					},
				},
			});
		},
	});
	const selection = useSelection<EntitySchema.Type>({
		mode: "single",
		initial: listing.restriction
			? [
					{
						id: listing.restriction,
					},
				]
			: [],
		deps: [
			listing,
		],
		onSelect(item) {
			form.setFieldValue("restriction", (item?.id as RestrictionEnumSchema.Type) ?? null);
			form.setFieldMeta("restriction", (meta) => ({
				...meta,
				isTouched: true,
			}));
		},
	});

	return (
		<TitleContainer
			data-ui={"RestrictionPatch"}
			textTitle={translator.text("Listing restriction (title)")}
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
				<form.AppField name={"restriction"}>
					{(_field) => (
						<RestrictionSelect
							selection={selection}
							minLevel={listing.category?.restriction ?? "none"}
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
							onCancel={onCancel}
							onSave={() => {
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
