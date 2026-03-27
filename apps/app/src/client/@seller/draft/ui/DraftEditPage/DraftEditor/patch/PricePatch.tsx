import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Dial } from "@zbav-se.me/ui/dial";
import { useAppForm } from "@zbav-se.me/ui/form";
import type { FC } from "react";
import { z } from "zod";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { withDraftQuery } from "~/client/@seller/draft/withDraftQuery";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import { ListingCreateSchema } from "~/server/@seller/listing/schema/ListingCreateSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const PriceSchema = z.object({
	price: z.number().nullable(),
});

const ListingPriceSchema = ListingCreateSchema.pick({
	price: true,
}) as z.ZodType<{
	price: number | null;
}>;

export namespace PricePatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const PricePatch: FC<PricePatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("priceType");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			price: draft.price ?? null,
		},
		validators: {
			onMount: PriceSchema,
			onChange: PriceSchema,
			onBlur: PriceSchema,
			onSubmit: PriceSchema,
		},
		async onSubmit({ value }) {
			const parsed = ListingPriceSchema.safeParse(value);

			if (!parsed.success) {
				return;
			}

			mutation.mutate({
				patch: {
					price: parsed.data.price,
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
			data-ui={"Setup-[TitleContainer.price]"}
			textTitle={translator.text("Price (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
					gap: "default",
				}}
			>
				<form.AppField name={"price"}>
					{(field) => (
						<Dial
							value={
								typeof field.state.value === "number"
									? String(field.state.value)
									: undefined
							}
							onChange={(value) => {
								field.handleChange(
									value === undefined ? null : Number.parseFloat(value),
								);
								field.handleBlur();
							}}
							placeholder={translator.text("Price (placeholder)")}
							ui={{
								inner: "default",
							}}
						/>
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
