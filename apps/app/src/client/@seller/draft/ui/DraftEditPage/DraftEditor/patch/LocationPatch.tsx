import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useAppForm } from "@zbav-se.me/ui/form";
import { type FC, useState } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { LocationSelect } from "~/client/@common/location/ui/LocationSelect";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/client/@seller/draft/server/schema/DraftSchema";
import { ListingCreateSchema } from "~/client/@seller/listing/server/schema/ListingCreateSchema";
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
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
					gap: "default",
				}}
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
