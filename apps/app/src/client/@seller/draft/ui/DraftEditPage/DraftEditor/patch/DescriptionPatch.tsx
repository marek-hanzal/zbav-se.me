import { ArrowRightIcon } from "@use-pico/client/icon";
import { Container } from "@use-pico/client/ui/container";
import { FormField, uiInput } from "@use-pico/client/ui/form";
import { Mx } from "@use-pico/client/ui/mx";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { type FC, useState } from "react";
import { SaveContainer } from "~/client/@common/container/ui/SaveContainer";
import { withDraftQuery } from "~/client/@seller/draft/query/withDraftQuery";
import type { DraftSchema } from "~/server/@seller/draft/schema/DraftSchema";
import type { DraftEditor } from "../DraftEditor";
import { EditAction } from "../EditAction";

const DESCRIPTION_MAX_LENGTH = 2048;

export namespace DescriptionPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancel(): void;
		onView(view: DraftEditor.View): void;
	}
}

export const DescriptionPatch: FC<DescriptionPatch.Props> = ({
	draft,
	onCancel,
	onView,
	...props
}) => {
	const [description, setDescription] = useState(draft.description ?? "");
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			onView("pros");
		},
		invalidate: [
			"collection",
		],
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
									maxLength={DESCRIPTION_MAX_LENGTH}
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
