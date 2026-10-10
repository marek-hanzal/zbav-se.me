import { type FC, useState } from "react";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { uiInputFn } from "~/form/fn/uiInputFn";
import { FormField } from "~/form/ui/FormField";
import { withDraftQuery } from "~/seller-draft/query/withDraftQuery";
import type { DraftSchema } from "~/seller-draft/schema/DraftSchema";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Mx } from "~/translation/ui/Mx";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import { Status } from "~/ui/ui/Status";
import type { useView } from "~/view/hook/useView";

const DESCRIPTION_MAX_LENGTH = 2048;

export namespace DescriptionPatch {
	export interface Props extends TitleContainer.Props {
		draft: DraftSchema.Type;
		onCancelFn(): void;
		view: useView.Use<"pros">;
	}
}

export const DescriptionPatch: FC<DescriptionPatch.Props> = ({
	draft,
	onCancelFn,
	view,
	...props
}) => {
	const translator = useTranslator();
	const [description, setDescriptionFn] = useState(draft.description ?? "");
	const mutation = withDraftQuery.usePatchMutation({
		onSuccess() {
			view.setFn("pros");
		},
		invalidate: [
			"collection",
		],
	});

	return (
		<TitleContainer
			data-ui={"DescriptionPatch"}
			textTitle={translator.textFn("Description (title)")}
			left={<EditAction />}
			{...props}
		>
			<Container
				data-ui-layout="vertical-content-footer"
				data-ui-height="full"
				data-ui-width="full"
				data-ui-inner="default"
			>
				<Status
					action={
						<FormField>
							{({ className, ...props }) => (
								<textarea
									value={description}
									onChange={(e) => {
										setDescriptionFn(e.target.value);
									}}
									placeholder={translator.textFn("Description (placeholder)")}
									maxLength={DESCRIPTION_MAX_LENGTH}
									rows={10}
									{...uiInputFn({
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
						data-ui-tone="secondary"
						data-ui-theme="light"
					/>
				</Status>

				<SaveContainer
					onCancelFn={onCancelFn}
					onSaveFn={() => {
						mutation.mutate({
							patch: {
								description,
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
