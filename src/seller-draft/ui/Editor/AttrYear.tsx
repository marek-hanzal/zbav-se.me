import { DateTime } from "luxon";
import type { FC } from "react";
import { YearSelect } from "~/application-ui/ui/YearSelect";
import { SaveContainer } from "~/container/ui/SaveContainer";
import { useSelection } from "~/selection/hook/useSelection";
import { getNextAttrFn } from "~/seller-draft/fn/getNextAttrFn";
import { withDraftAttrNumberPatchMutation } from "~/seller-draft-attr-number/mutation/withDraftAttrNumberPatchMutation";
import { Tx } from "~/translation/ui/Tx";
import { ArrowRightIcon } from "~/ui/constant/ArrowRightIcon";
import { Container } from "~/ui/ui/Container";
import type { DraftAttrOfSchema } from "~/user-draft-attr/schema/DraftAttrOfSchema";
import type { useView } from "~/view/hook/useView";

export namespace AttrYear {
	export interface Props extends Container.Props {
		draftId: string;
		attrs: DraftAttrOfSchema.Type[];
		attr: Extract<
			DraftAttrOfSchema.Type,
			{
				type: "year";
			}
		>;
		view: useView.Use<any>;
	}
}

export const AttrYear: FC<AttrYear.Props> = ({ draftId, attrs, attr, view, ...props }) => {
	const next = getNextAttrFn(attr, attrs);
	const mutation = withDraftAttrNumberPatchMutation.useMutation({
		onSuccess() {
			view.setFn(next ? `attr.${next.name}` : "default");
		},
	});

	const selection = useSelection({
		mode: "single",
		initial:
			typeof attr.value === "number"
				? [
						{
							id: String(attr.value),
						},
					]
				: [
						{
							id: String(DateTime.now().year),
						},
					],
	});
	const selectedYear = selection.optional.singleIdFn();

	return (
		<Container
			data-ui={"AttrYear"}
			data-ui-layout="vertical-content-footer"
			data-ui-height="full"
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-gap="default"
			{...props}
		>
			<YearSelect
				from={attr.min}
				to={attr.max}
				selection={selection}
			/>

			<SaveContainer
				onCancelFn={() => {
					view.setFn("default");
				}}
				onSaveFn={() => {
					mutation.mutate({
						fieldId: attr.name,
						draftId,
						value: selectedYear ? Number.parseInt(selectedYear, 10) : null,
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
