import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const ContentCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"viewport",
			"content",
			"fadeTop",
			"fadeBottom",
		],
		variant: {},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.css([
					"relative",
					"min-h-0",
					"h-full",
					"overflow-hidden",
					// barva fadu MUSÍ odpovídat pozadí obsahu
					"[--fade-color:rgb(224_231_255)]", // např. Tailwind bg-indigo-100
					"[--fade-solid:8px]", // plný pás pro schování sub-pixel linky
				]),

				viewport: what.css([
					"h-full",
					"overflow-auto",
					"overscroll-contain",
					"z-0",
				]),

				content: what.css([
					"min-h-full",
					"grid",
					"content-start",
					"justify-center",
					"px-0",
				]),

				fadeTop: what.css([
					"pointer-events-none",
					"absolute",
					"inset-x-0",
					"-top-px", // překryj hranu o 1px
					"z-10",
					"opacity-0",
					"transition-opacity",
					"will-change-[opacity]",
					"bg-[linear-gradient(to_bottom,var(--fade-color),var(--fade-color)_var(--fade-solid),transparent)]",
				]),

				fadeBottom: what.css([
					"pointer-events-none",
					"absolute",
					"inset-x-0",
					"-bottom-px",
					"z-10",
					"opacity-0",
					"transition-opacity",
					"will-change-[opacity]",
					"bg-[linear-gradient(to_top,var(--fade-color),var(--fade-color)_var(--fade-solid),transparent)]",
				]),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type ContentCls = typeof ContentCls;
export namespace ContentCls {
	export type Props<P = unknown> = Cls.Props<ContentCls, P>;
}
