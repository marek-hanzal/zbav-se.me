import { getLogger } from "@logtape/logtape";
import { type FC, useMemo, useRef, useState } from "react";
import { useRenderLogger } from "../log/useRenderLogger";
import { Panel } from "./Panel";
import { View } from "./View";

export namespace useView {
	export interface Props<TPanel extends string, TProps extends object | unknown = unknown> {
		/**
		 * Panels _are not reactive_ - they're cached
		 * so we can use stable references for everything.
		 */
		panels: TPanel[];
		/**
		 * Not reactive, bro. Just default.
		 */
		defaultPanel: TPanel;
		/**
		 * Optional set of props you'll get when switching panels.
		 *
		 * Non-reactive, captured on the first call.
		 */
		props?: Partial<Record<TPanel, TProps>>;
	}

	export interface Use<TPanel extends string, TProps extends object | unknown = unknown> {
		View: FC<Omit<View.Props<TPanel>, "control">>;
		Panel: FC<Omit<Panel.Props<TPanel>, "control">>;
		isVisible(name: TPanel): boolean;
		set(name: TPanel): void;
		props: TProps | undefined;
	}
}

export const useView = <TPanel extends string, TProps extends object | unknown = unknown>({
	panels: _,
	defaultPanel,
	props,
}: useView.Props<TPanel, TProps>): useView.Use<TPanel, TProps> => {
	useRenderLogger({
		logger: getLogger([
			"lib",
			"client",
		]),
		name: "useView",
	});

	const [panel, setPanel] = useState(defaultPanel);

	const panelRef = useRef(defaultPanel);
	/**
	 * Little hack, so useMemo can be stable.
	 */
	panelRef.current = panel;

	// biome-ignore lint/correctness/useExhaustiveDependencies: Ont-shot-only.
	const control = useMemo(() => {
		return {
			View(props) {
				return (
					<View
						control={control}
						{...props}
					/>
				);
			},
			Panel(props) {
				return (
					<Panel
						control={control}
						{...props}
					/>
				);
			},
			isVisible(name) {
				return panelRef.current === name;
			},
			set(name) {
				setPanel(name);
			},
			get props() {
				return props?.[panelRef.current];
			},
		} satisfies useView.Use<TPanel, TProps>;
	}, []);

	return control;
};
