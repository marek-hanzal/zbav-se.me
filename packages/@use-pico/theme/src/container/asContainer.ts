import { attr } from "../attr/attr";

const attributes = [
	"theme",
	"tone",
	"height",
	"width",
	"inner",
	"gap",
	"position",
	"disabled",
	"snapTo",
] satisfies (keyof attr.Attributes)[];
type Attributes = (typeof attributes)[number];

export namespace asContainer {
	export type Layout =
		//
		| "vertical"
		| "vertical-full"
		| "vertical-header-content-footer"
		| "vertical-header-content"
		| "vertical-content-footer"
		| "vertical-centered"
		| "vertical-flex"
		//
		| "horizontal"
		| "horizontal-full"
		| "horizontal-flex";
	export type Scroll = "vertical" | "horizontal" | "hidden";
	export type Snap = "vertical" | "horizontal";
	export type SnapAlign = "start" | "center" | "end";

	export type Props<TRest extends attr.Rest> = attr.Component<Attributes, TRest> & {
		layout?: Layout;
		scroll?: Scroll;
		snap?: Snap;
		snapAlign?: SnapAlign;
	};
}

export const asContainer = <const TRest extends attr.Rest>(props: asContainer.Props<TRest>) => {
	return attr({
		ui: "Container",
		attrs: attributes,
		//
		...props,
	});
};
