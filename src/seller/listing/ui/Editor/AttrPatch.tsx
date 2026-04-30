import type { FC } from "react";
import { match } from "ts-pattern";
import type { useView } from "@/lib/client/view2";
import { translator } from "@/lib/common/translator";
import { EditAction } from "~/common/ui/action/EditAction";
import { TitleContainer } from "~/common/ui/container";
import type { AttrOfSchema } from "~/user/attr/server/schema/AttrOfSchema";
import { AttrEnumMulti } from "./AttrEnumMulti";
import { AttrEnumSingle } from "./AttrEnumSingle";

export namespace AttrPatch {
	export interface Props extends TitleContainer.Props {
		listingId: string;
		attr: AttrOfSchema.Type;
		view: useView.Use<any>;
	}
}

export const AttrPatch: FC<AttrPatch.Props> = ({ listingId, attr, view, ...props }) => {
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
								attr={attr}
								view={view}
							/>
						);
					},
				)
				.otherwise((type) => {
					return `nope: ${type}`;
				})}
		</TitleContainer>
	);
};
