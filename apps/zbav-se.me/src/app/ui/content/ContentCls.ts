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
				root: what.both(
					[
						"relative",
						"isolate",
						"min-h-0",
						"h-full",
						"overflow-hidden",
						"[--fade-color:var(--color-orange-200)]",
						"[--fade-solid:12px]",
					],
					[
						"round.lg",
					],
				),

				viewport: what.css([
					"h-full",
					"overflow-auto",
					"overscroll-contain",
					"z-0",
				]),

				content: what.css([
					"min-h-full",
					"grid",
					"content-center",
					"justify-items-stretch",
				]),

				// horní fade (gradient → plynule do transparent)
				fadeTop: what.css([
					"pointer-events-none",
					"absolute",
					"inset-x-0",
					"-top-px",
					"z-10",
					"opacity-0",
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
