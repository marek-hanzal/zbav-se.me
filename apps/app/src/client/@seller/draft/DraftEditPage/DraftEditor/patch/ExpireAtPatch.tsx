import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { Mx } from "@use-pico/client/ui/mx";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft, tListingExpireEnum } from "@zbav-se.me/sdk/api/seller";
import { zListingCreate } from "@zbav-se.me/sdk/api/seller";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { useAppForm } from "@zbav-se.me/ui/form";
import type { FC } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { ExpireAtSelect } from "~/client/@common/expire-at/ui/ExpireAtSelect";
import { withDraftQuery } from "~/client/@seller/draft/withDraftQuery";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const ExpireAtSchema = zListingCreate.pick({
	expiresAt: true,
});

export namespace ExpireAtPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const ExpireAtPatch: FC<ExpireAtPatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("restriction");
		},
		invalidate: [
			"collection",
		],
	});
	const form = useAppForm({
		defaultValues: {
			expiresAt: (draft.expiresAt as tListingExpireEnum | null) ?? null,
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
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
					gap: "default",
				}}
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
								ui={{
									tone: "neutral",
									theme: "light",
									inner: "default",
									color: "lead",
									opacity: "7",
								}}
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
