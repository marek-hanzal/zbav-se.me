import { Container } from "@use-pico/client/ui/container";
import { FormField, uiInput } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tDraft } from "@zbav-se.me/sdk/api/seller-user";
import { sDraftCreate } from "@zbav-se.me/sdk/api/seller-user";
import { withDraftQuery } from "@zbav-se.me/sdk/query/seller-user/draft";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/app/@common/container/ui/SaveContainer";
import { EditAction } from "~/app/@seller-user/draft/ui/DraftEditor/EditAction";

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
		invalidate: [
			"collection",
		],
		onSettled,
	});

	return (
		<TitleContainer
			data-ui={"Setup-[TitleContainer.description]"}
			textTitle={translator.text("Description (title)")}
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
					}
				>
					<Mx
						label={"Listing description (hint)"}
						ui={{
							tone: "secondary",
							theme: "light",
						}}
					/>
				</Status>

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
					textCancel={<Tx label={"Back (label)"} />}
				/>
			</Container>
		</TitleContainer>
	);
};
