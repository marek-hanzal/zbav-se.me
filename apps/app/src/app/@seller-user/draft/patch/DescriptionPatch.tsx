import { Container } from "@use-pico/client/ui/container";
import { FormField, uiInput } from "@use-pico/client/ui/form";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { sDraftCreate } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftPatchMutation } from "@zbav-se.me/sdk/mutation/seller-user/draft";
import { withDraftFetchQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveControl } from "~/app/@common/control/SaveControl";

export namespace DescriptionPatch {
	export interface Props extends TitleContainer.Props {
		draft: tDraft;
		onCancel(): void;
		onSettled?(): void;
	}
}

export const DescriptionPatch: FC<DescriptionPatch.Props> = ({
	draft,
	onCancel,
	onSettled,
	...props
}) => {
	const patch = withDraftFetchQuery.useSet();
	const [description, setDescription] = useState(draft.description ?? "");

	const mutation = withDraftPatchMutation.useMutation({
		onSuccess(draft) {
			patch(() => draft, {
				where: {
					id: draft.id,
				},
			});
		},
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.description]"}
			textTitle={"Description (title)"}
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
				<Container
					ui={{
						layout: "vertical-centered",
						height: "full",
					}}
				>
					<Status
						textTitle={"Description (title)"}
						textMessage={"Description (message)"}
					>
						<FormField>
							{({ className, ...props }) => (
								<textarea
									value={description}
									onChange={(e) => {
										setDescription(e.target.value);
									}}
									placeholder={translator.text("Description (placeholder)")}
									maxLength={sDraftCreate.properties.description.maxLength}
									rows={10}
									{...uiInput({
										ui: {
											...props.ui,
										},
										className: [
											"resize-none",
											"outline-none",
											"min-h-0",
											className,
										],
									})}
									{...props}
								/>
							)}
						</FormField>
					</Status>
				</Container>

				<SaveControl
					onCancel={onCancel}
					onSave={() => {
						mutation.mutate({
							patch: {
								description: description || null,
							},
							query: {
								where: {
									id: draft.id,
								},
							},
						});
					}}
					loading={mutation.isPending}
					disabled={false}
				/>
			</Container>
		</TitleContainer>
	);
};
