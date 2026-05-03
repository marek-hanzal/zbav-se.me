import type { FC } from "react";
import { match } from "ts-pattern";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translation";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import type { DraftAttrOfSchema } from "~/user/draft-attr/server/schema/DraftAttrOfSchema";
import { AttrDecimal } from "./AttrDecimal";
import { AttrEnumMulti } from "./AttrEnumMulti";
import { AttrEnumSingle } from "./AttrEnumSingle";
import { AttrNumber } from "./AttrNumber";
import { AttrRange } from "./AttrRange";
import { AttrText } from "./AttrText";
import { AttrYear } from "./AttrYear";

export namespace AttrPatch {
	export interface Props extends TitleContainer.Props {
		draftId: string;
		attrs: DraftAttrOfSchema.Type[];
		attr: DraftAttrOfSchema.Type;
		view: useView.Use<any>;
	}
}

export const AttrPatch: FC<AttrPatch.Props> = ({ draftId, attrs, attr, view, ...props }) => {
	return (
		<TitleContainer
			data-ui={`AttrPatch-${attr.name}`}
			textTitle={translator.text(`Field patch - ${attr.name} (title)`)}
			left={<EditAction />}
			data-ui-layout={"vertical-header-content"}
			{...props}
		>
			{match(attr)
				.with(
					{
						type: "enum-single",
					},
					(attr) => {
						return (
							<AttrEnumSingle
								draftId={draftId}
								attrs={attrs}
								attr={attr}
								view={view}
							/>
						);
					},
				)
				.with(
					{
						type: "enum-multi",
					},
					(attr) => {
						return (
							<AttrEnumMulti
								draftId={draftId}
								attrs={attrs}
								attr={attr}
								view={view}
							/>
						);
					},
				)
				.with(
					{
						type: "decimal",
					},
					(attr) => {
						return (
							<AttrDecimal
								draftId={draftId}
								attrs={attrs}
								attr={attr}
								view={view}
							/>
						);
					},
				)
				.with(
					{
						type: "number",
					},
					(attr) => {
						return (
							<AttrNumber
								draftId={draftId}
								attrs={attrs}
								attr={attr}
								view={view}
							/>
						);
					},
				)
				.with(
					{
						type: "year",
					},
					(attr) => {
						return (
							<AttrYear
								draftId={draftId}
								attrs={attrs}
								attr={attr}
								view={view}
							/>
						);
					},
				)
				.with(
					{
						type: "range",
					},
					(attr) => {
						return (
							<AttrRange
								draftId={draftId}
								attrs={attrs}
								attr={attr}
								view={view}
							/>
						);
					},
				)
				.with(
					{
						type: "text",
					},
					(attr) => {
						return (
							<AttrText
								draftId={draftId}
								attrs={attrs}
								attr={attr}
								view={view}
							/>
						);
					},
				)
				.exhaustive()}
		</TitleContainer>
	);
};
