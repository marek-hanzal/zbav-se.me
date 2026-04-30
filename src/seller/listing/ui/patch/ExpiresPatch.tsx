import type { FC } from "react";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { Mx } from "@/lib/client/mx";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translator";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { ExpireAtSelect } from "~/common/expire-at/ui/ExpireAtSelect";
import { ListingExpireEnumSchema } from "~/common/listing/enum/ListingExpireEnumSchema";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import { useAppForm } from "~/common/ui/form";
import { withListingQuery } from "../../query/withListingQuery";
import type { ListingSchema } from "../../server/schema/ListingSchema";

const FormSchema = z
	.looseObject({
		expires: ListingExpireEnumSchema,
	})
	.strip();

export namespace ExpiresPatch {
	export interface Props extends TitleContainer.Props {
		listing: ListingSchema.Type;
		onCancel(): void;
		view: useView.Use<"default">;
	}
}

export const ExpiresPatch: FC<ExpiresPatch.Props> = ({ listing, onCancel, view, ...props }) => {
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
			expires: listing.expires,
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
						id: listing.id,
					},
				},
			});
		},
	});

	return (
		<TitleContainer
			data-ui={"ExpireAtPatch"}
			textTitle={translator.text("Expire (title)")}
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
