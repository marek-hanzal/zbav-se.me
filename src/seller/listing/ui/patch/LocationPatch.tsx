import { type FC, useState } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { LocationSelect } from "~/common/location/ui/LocationSelect";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

const FormSchema = z
	.looseObject({
		locationId: z.string().min(1),
	})
	.strip();

export namespace LocationPatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		setView(view: "price"): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({
	listing,
	onCancel,
	setView,
	...props
}) => {
	const [isSearchPendingSelection, setIsSearchPendingSelection] = useState(false);
	const mutation = withListingQuery.usePatchMutation({
		onSuccess() {
			setView("price");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			locationId: listing.locationId ?? null,
		},
		validators: {
			onMount: FormSchema,
			onChange: FormSchema,
			onBlur: FormSchema,
			onSubmit: FormSchema,
		},
		async onSubmit({ value }) {
			mutation.mutate({
				patch: {
					locationId: value.locationId ?? undefined,
				},
				query: {
					where: {
						id: listing.id,
					},
				},
			});
		},
	});

	return (
		<TitleContainer
			data-ui={"LocationPatch"}
			textTitle={translator.text("Location (title)")}
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
							textHint={translator.text("Location security (hint)")}
							onChange={(value) => {
								field.handleChange(value);
								field.handleBlur();
								setIsSearchPendingSelection(false);
							}}
							onSearchChange={(value) => {
								const hasSearch = Boolean(value?.trim());

								setIsSearchPendingSelection(hasSearch);
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
							onCancel={onCancel}
							onSave={() => {
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
