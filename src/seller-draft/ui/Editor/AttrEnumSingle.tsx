import type { FC } from "react";
import { uiSelectButtonFn } from "~/application-ui/fn/ui.exports";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useSelection } from "~/selection/hook/useSelection";
import { getNextAttrFn } from "~/seller-draft/fn/getNextAttrFn";
import { withDraftAttrEnumSinglePatchMutation } from "~/seller-draft-attr-enum-single/mutation/withDraftAttrEnumSinglePatchMutation";
import { useTranslator } from "~/translation/hook/useTranslator";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";
import type { DraftAttrOfSchema } from "~/user-draft-attr/schema/DraftAttrOfSchema";
import type { useView } from "~/view/hook/useView";

export namespace AttrEnumSingle {
	export interface Props extends Container.Props {
		draftId: string;
		attrs: DraftAttrOfSchema.Type[];
		attr: Extract<
			DraftAttrOfSchema.Type,
			{
				type: "enum-single";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrEnumSingle: FC<AttrEnumSingle.Props> = ({
	draftId,
	attrs,
	attr,
	view,
	...props
}) => {
	const translator = useTranslator();
	const next = getNextAttrFn(attr, attrs);
	const mutation = withDraftAttrEnumSinglePatchMutation.useMutation({
		onSuccess() {
			view.setFn(next ? `attr.${next.name}` : "default");
		},
	});
	const selection = useSelection({
		mode: "single",
		initial: attr.value
			? [
					{
						id: attr.value,
					},
				]
			: [],
	});

	return (
		<Container
			data-ui={"AttrEnumSingle"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<Container
				data-ui-height={"full"}
				data-ui-scroll={"vertical"}
			>
				<Container
					data-ui-height={"auto"}
					data-ui-flow={"vertical"}
					data-ui-gap={"default"}
				>
					{attr.options.map((option) => {
						const selected = selection.isSelectedFn(option.value);

						return (
							<Button
								key={option.value}
								onClick={() => {
									selection.toggleFn({
										id: option.value,
									});
								}}
								iconProps={{
									"data-ui-text": "2xl",
									"data-ui-color": selected ? "lead" : "icon",
								}}
								{...uiSelectButtonFn({
									isSelected: selected,
									"data-ui-flow": "horizontal",
									"data-ui-justify": "start",
									"data-ui-items": "center",
									"data-ui-gap": "sm",
									"data-ui-size": "default",
									"data-ui-text": "lg",
									className: [
										"text-left",
										"shrink-0",
									],
								})}
							>
								{translator.textFn(`${attr.name} - ${option.value}`, option.value)}
							</Button>
						);
					})}
				</Container>
			</Container>

			<SaveContainer
				onCancelFn={() => {
					view.setFn("default");
				}}
				onSaveFn={() => {
					mutation.mutate({
						fieldId: attr.name,
						draftId,
						value: selection.optional.singleIdFn() ?? null,
					});
				}}
				loading={mutation.isPending}
				disabled={mutation.isPending}
				textSave={<Tx label={"Continue (label)"} />}
				textCancel={<Tx label={"Back (label)"} />}
				saveProps={{
					iconEnabled: ArrowRightIcon,
					iconPosition: "right",
				}}
			/>
		</Container>
	);
};
