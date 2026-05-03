import type { FC } from "react";
import { match } from "ts-pattern";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translation";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import type { ListingAttrOfSchema } from "~/user/listing-attr/server/schema/ListingAttrOfSchema";
import { AttrDecimal } from "./AttrDecimal";
import { AttrEnumMulti } from "./AttrEnumMulti";
import { AttrEnumSingle } from "./AttrEnumSingle";
import { AttrNumber } from "./AttrNumber";
import { AttrRange } from "./AttrRange";
import { AttrText } from "./AttrText";
import { AttrYear } from "./AttrYear";

export namespace AttrPatch {
	export interface Props extends TitleContainer.Props {
		listingId: string;
		attrs: ListingAttrOfSchema.Type[];
		attr: ListingAttrOfSchema.Type;
		view: useView.Use<any>;
	}
}

export const AttrPatch: FC<AttrPatch.Props> = ({ listingId, attrs, attr, view, ...props }) => {
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
								listingId={listingId}
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
								listingId={listingId}
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
								listingId={listingId}
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
								listingId={listingId}
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
								listingId={listingId}
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
								listingId={listingId}
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
								listingId={listingId}
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
