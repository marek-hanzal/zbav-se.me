import { type FC, useState } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Tx } from "@/lib/client/tx";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { LocationSelect } from "~/common/location/ui/LocationSelect";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withDraftQuery } from "~/seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller/draft/server/schema/DraftSchema";
import { ListingCreateSchema } from "~/seller/listing/server/schema/ListingCreateSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const LocationSchema = ListingCreateSchema.pick({
	locationId: true,
});

export namespace LocationPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const LocationPatch: FC<LocationPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const [isSearchPendingSelection, setIsSearchPendingSelection] = useState(false);
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("price");
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
			onMount: LocationSchema,
			onChange: LocationSchema,
			onBlur: LocationSchema,
			onSubmit: LocationSchema,
		},
		async onSubmit({ value }) {
			mutation.mutate({
				patch: {
					locationId: value.locationId,
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
			data-ui={"Setup-[TitleContainer.location]"}
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

				<form.Subscribe selector={(state) => state.isValid}>
					{(isValid) => (
						<SaveContainer
							onCancel={onCancel}
							onSave={() => {
								form.handleSubmit();
							}}
							loading={mutation.isPending}
							disabled={!isValid || isSearchPendingSelection || mutation.isPending}
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
