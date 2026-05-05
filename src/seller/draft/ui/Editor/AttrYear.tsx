import { DateTime } from "luxon";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ArrowRightIcon } from "@/lib/client/icon";
import { useSelection } from "@/lib/client/selection";
import { Tx } from "@/lib/client/tx";
import type { useView } from "@/lib/client/view";
import { SaveContainer } from "~/common/container/ui/SaveContainer";
import { YearSelect } from "~/common/ui/year/YearSelect";
import { withDraftAttrNumberPatchMutation } from "~/seller/draft-attr-number/mutation/withDraftAttrNumberPatchMutation";
import type { DraftAttrOfSchema } from "~/user/draft-attr/server/schema/DraftAttrOfSchema";
import { useNextAttr } from "./useNextAttr";

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
	const next = useNextAttr(attr, attrs);
	const mutation = withDraftAttrNumberPatchMutation.useMutation({
		onSuccess() {
			view.set(next ? `attr.${next.name}` : "default");
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
	const selectedYear = selection.optional.singleId();

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
				onCancel={() => {
					view.set("default");
				}}
				onSave={() => {
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
