import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { uiSelectButton } from "~/common/ui/ui";
import { withDraftAttrEnumMultiPatchMutation } from "~/seller/draft-attr-enum-multi/mutation/withDraftAttrEnumMultiPatchMutation";
import type { DraftAttrOfSchema } from "~/user/draft-attr/server/schema/DraftAttrOfSchema";
import { useNextAttr } from "./useNextAttr";

export namespace AttrEnumMulti {
	export interface Props extends Container.Props {
		draftId: string;
		attrs: DraftAttrOfSchema.Type[];
		attr: Extract<
			DraftAttrOfSchema.Type,
			{
				type: "enum-multi";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrEnumMulti: FC<AttrEnumMulti.Props> = ({
	draftId,
	attrs,
	attr,
	view,
	...props
}) => {
	const next = useNextAttr(attr, attrs);
	const mutation = withDraftAttrEnumMultiPatchMutation.useMutation({
		onSuccess() {
			view.set(next ? `attr.${next.name}` : "default");
		},
	});
	const selection = useSelection({
		mode: "multi",
		initial: attr.value.map((item) => ({
			id: item,
		})),
	});

	return (
		<Container
			data-ui={"AttrEnumMulti"}
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
						const selected = selection.isSelected(option.value);

						return (
							<Button
								key={option.value}
								onClick={() => {
									selection.toggle({
										id: option.value,
									});
								}}
								iconProps={{
									"data-ui-text": "2xl",
									"data-ui-color": selected ? "lead" : "icon",
								}}
								{...uiSelectButton({
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
								{translator.text(`${attr.name} - ${option.value}`, option.value)}
							</Button>
						);
					})}
				</Container>
			</Container>

			<SaveContainer
				onCancel={() => {
					view.set("default");
				}}
				onSave={() => {
					mutation.mutate({
						draftId,
						fieldId: attr.name,
						value: selection.optional.multiId(),
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
