import type { Theme } from "../../../client/src/ui/Ui";
import { attr } from "../ui/attr";

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

	export interface Attributes extends Pick<Theme.Attrs, "theme" | "tone"> {
		layout?: Layout;
		scroll?: Scroll;
		snap?: Snap;
		snapAlign?: SnapAlign;
	}

	export type Props<TRest extends attr.Rest> = attr.Component<Attributes, TRest> & {
		//
	};
}

export const asContainer = <const TRest extends attr.Rest>(props: asContainer.Props<TRest>) => {
	return attr<asContainer.Attributes>({
		ui: "Container",
		attrs: [
			"theme",
			"tone",
			"height",
			"width",
			"inner",
			"gap",
			"position",
			"disabled",
			"justify",
			"items",
			"snapTo",
			"layout",
			"scroll",
			"snap",
			"snapAlign",
		] as const,
		//
		...props,
	});
};
