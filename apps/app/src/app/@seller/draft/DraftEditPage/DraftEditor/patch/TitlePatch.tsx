import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { type FormError, FormField } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { TextInput } from "@use-pico/client/ui/text-input";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller";
import { sListingCreate, zListingCreate } from "@zbav-se.me/sdk/api/seller";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import type { Data } from "../Data";
import { EditAction } from "../EditAction";

const TitleSchema = zListingCreate.pick({
	title: true,
});

export namespace TitlePatch {
	export interface ValidationProps {
		isTouched: boolean;
		isDirty: boolean;
		title: string;
	}

	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onView(view: Data.View): void;
	}
}

const toTitleMeta = ({ isTouched, isDirty, title }: TitlePatch.ValidationProps): FormError.Meta => {
	const result = TitleSchema.safeParse({
		title,
	});

	return {
		isTouched,
		isDirty,
		errors: result.success
			? undefined
			: [
					{
						message: result.error.issues[0]?.message ?? "Invalid listing title",
					},
				],
	};
};

export const TitlePatch: FC<TitlePatch.Props> = ({ draft, onCancel, onView, ...props }) => {
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("category");
		},
		invalidate: [
			"collection",
		],
	});
	const [title, setTitle] = useState(draft.title ?? "");
	const [isTouched, setIsTouched] = useState(false);
	const titleMeta = toTitleMeta({
		isTouched,
		isDirty: title !== (draft.title ?? ""),
		title,
	});
	const isInvalid = !!titleMeta.errors?.length;

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.title]"}
			textTitle={translator.text("Listing title (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				ui={{
					layout: "vertical-content-footer",
					height: "full",
					width: "full",
					inner: "default",
				}}
			>
				<Status
					action={
						<FormField meta={titleMeta}>
							{(fieldProps) => (
								<TextInput
									value={title}
									onChange={(e) => {
										setTitle(e.target.value);
									}}
									onBlur={() => {
										setIsTouched(true);
									}}
									placeholder={translator.text("Listing title (placeholder)")}
									autoFocus
									minLength={sListingCreate.properties.title.minLength}
									maxLength={sListingCreate.properties.title.maxLength}
									{...fieldProps}
								/>
							)}
						</FormField>
					}
				>
					<Mx
						label={"Listing title (required)"}
						ui={{
							tone: "secondary",
							theme: "light",
						}}
					/>
				</Status>

				<SaveContainer
					onCancel={onCancel}
					onSave={() => {
						if (isInvalid) {
							setIsTouched(true);
							return;
						}

						mutation.mutate({
							patch: {
								title,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={isInvalid}
					textSave={<Tx label={"Continue (label)"} />}
					textCancel={<Tx label={"Back (label)"} />}
					saveProps={{
						iconEnabled: ArrowRightIcon,
						iconPosition: "right",
					}}
				/>
			</Container>
		</TitleContainer>
	);
};
