import { ThemeCls } from "~/app/ui/ThemeCls";

export const DriverCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"popover",
			"progress",
		],
		variant: {},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				popover: what.both(
					[
						"fixed",
						"z-[99999]",
						"max-w-[90%]",
						"top-0",
						"right-0",
					],
					[
						"square.md",
						"shadow.default",
						"round.lg",
						"border.default",
						"tone.secondary.light.bg",
						"tone.secondary.light.text",
						"tone.secondary.light.border",
						"tone.secondary.light.shadow",
					],
				),
				progress: what.both(
					[],
					[
						"tone.danger.light.text",
					],
				),
			}),
		],
		defaults: def.defaults({}),
	}),
);
