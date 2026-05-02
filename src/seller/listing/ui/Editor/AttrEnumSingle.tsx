import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translation";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { uiSelectButton } from "~/common/ui/ui";
import { withAttrEnumSinglePatchMutation } from "~/seller/attr-enum-single/mutation/withAttrEnumSinglePatchMutation";
import type { AttrOfSchema } from "~/user/attr/server/schema/AttrOfSchema";

export namespace AttrEnumSingle {
	export interface Props extends Container.Props {
		listingId: string;
		attr: Extract<
			AttrOfSchema.Type,
			{
				type: "enum-single";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrEnumSingle: FC<AttrEnumSingle.Props> = ({ listingId, attr, view, ...props }) => {
	const mutation = withAttrEnumSinglePatchMutation.useMutation({
		onSuccess() {
			view.set("default");
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
						fieldId: attr.name,
						listingId,
						value: selection.optional.singleId() ?? null,
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
