import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import type { EntitySchema } from "@/lib/common/schema";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { ListingPriceEnumSchema } from "~/common/listing/enum/ListingPriceEnumSchema";
import { PriceTypeSelect } from "~/common/price-type/ui/PriceTypeSelect";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

const PriceTypeSchema = z
	.looseObject({
		priceType: ListingPriceEnumSchema,
	})
	.strip();

export namespace PriceTypePatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		view: useView.Use<"expires" | "price">;
	}
}

export const PriceTypePatch: FC<PriceTypePatch.Props> = ({ listing, onCancel, view, ...props }) => {
	const mutation = withListingQuery.usePatchMutation({
		onSuccess({ priceType }) {
			view.set(priceType === "offer" ? "expires" : "price");
		},
		invalidate: [
			"collection",
		],
	});

	const form = useAppForm({
		defaultValues: {
			priceType: listing.priceType ?? null,
		},
		validators: {
			onMount: PriceTypeSchema,
			onChange: PriceTypeSchema,
			onBlur: PriceTypeSchema,
			onSubmit: PriceTypeSchema,
		},
		async onSubmit({ value }) {
			return mutation.mutateAsync({
				patch: {
					priceType: value.priceType ?? undefined,
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
		initial: listing.priceType
			? [
					{
						id: listing.priceType,
					},
				]
			: [],
		deps: [
			listing,
		],
		onSelect(item) {
			if (!item) {
				return;
			}
			form.setFieldValue("priceType", item.id as ListingPriceEnumSchema.Type);
		},
	});

	return (
		<TitleContainer
			data-ui={"PriceTypePatch"}
			textTitle={translator.text("Price type (title)")}
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
				<form.AppField name={"priceType"}>
					{(_field) => <PriceTypeSelect selection={selection} />}
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
