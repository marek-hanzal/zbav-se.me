import { attr } from "../attr/attr";

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

	export type Props<TProps = unknown> = attr.PropsEx<
		| "theme"
		| "tone"
		| "height"
		| "width"
		| "inner"
		| "gap"
		| "position"
		| "disabled"
		| "snapTo",
		TProps
	> & {
		layout?: Layout;
		scroll?: Scroll;
		snap?: Snap;
		snapAlign?: SnapAlign;
	};
}

export const asContainer = ({ ...props }: asContainer.Props) => {
	return attr({
		ui: "Container",
		...props,
	});
};
