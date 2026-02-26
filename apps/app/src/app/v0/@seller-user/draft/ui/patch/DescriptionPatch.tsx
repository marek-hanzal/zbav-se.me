import { Container } from "@use-pico/client/ui/container";
import { FormField, uiInput } from "@use-pico/client/ui/form";
import { Status } from "@use-pico/client/ui/status";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { sDraftCreate } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/v0/@common/container/ui/SaveContainer";

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
	const [description, setDescription] = useState(draft.description ?? "");

	const mutation = withDraftQuery.usePatchMutation({
		onSettled() {
			onSettled?.();
		},
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.description]"}
			textTitle={translator.text("Description (title)")}
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
						textTitle={translator.text("Description (title)")}
						textMessage={translator.text("Description (message)")}
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

				<SaveContainer
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
