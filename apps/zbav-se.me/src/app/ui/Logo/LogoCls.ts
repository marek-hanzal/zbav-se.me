import type { Cls } from "@use-pico/cls";
import { ThemeCls } from "~/app/ui/ThemeCls";

export const LogoCls = ThemeCls.extend(
	{
		tokens: [],
		slot: [
			"root",
			"logo",
			"text",
		],
		variant: {},
	},
	({ what, def }) => ({
		token: def.token({}),
		rules: [
			def.root({
				root: what.css([]),
				logo: what.both(
					[
						"font-limelight",
						"text-4xl",
					],
					[
						"tone.primary.dark.text",
					],
				),
				text: what.both(
					[
						"text-xl",
						"font-bold",
					],
					[
						"tone.link.dark.text",
					],
				),
			}),
		],
		defaults: def.defaults({}),
	}),
);

export type LogoCls = typeof LogoCls;

export namespace LogoCls {
	export type Props<P = unknown> = Cls.Props<LogoCls, P>;
}
