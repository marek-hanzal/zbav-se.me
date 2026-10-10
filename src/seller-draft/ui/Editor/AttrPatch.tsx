import type { FC } from "react";
import { match } from "ts-pattern";
import { TitleContainer } from "~/application-ui/ui/container.exports";
import { EditAction } from "~/application-ui/ui/EditAction";
import { AttrDecimal } from "~/seller-draft/ui/Editor/AttrDecimal";
import { AttrEnumMulti } from "~/seller-draft/ui/Editor/AttrEnumMulti";
import { AttrEnumSingle } from "~/seller-draft/ui/Editor/AttrEnumSingle";
import { AttrNumber } from "~/seller-draft/ui/Editor/AttrNumber";
import { AttrRange } from "~/seller-draft/ui/Editor/AttrRange";
import { AttrText } from "~/seller-draft/ui/Editor/AttrText";
import { AttrYear } from "~/seller-draft/ui/Editor/AttrYear";
import { useTranslator } from "~/translation/hook/useTranslator";
import type { DraftAttrOfSchema } from "~/user-draft-attr/schema/DraftAttrOfSchema";
import type { useView } from "~/view/hook/useView";

export namespace AttrPatch {
	export interface Props extends TitleContainer.Props {
		draftId: string;
		attrs: DraftAttrOfSchema.Type[];
		attr: DraftAttrOfSchema.Type;
		view: useView.Use<any>;
	}
}

export const AttrPatch: FC<AttrPatch.Props> = ({ draftId, attrs, attr, view, ...props }) => {
	const translator = useTranslator();
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
