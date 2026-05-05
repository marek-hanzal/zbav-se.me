import { getLogger } from "@logtape/logtape";
import { type FC, useMemo, useRef, useState } from "react";
import { useRenderLogger } from "../log/useRenderLogger";
import { Panel } from "./Panel";
import { View } from "./View";

export namespace useView {
	export interface Props<TPanel extends string> {
		/**
		 * Panels _are not reactive_ - they're cached
		 * so we can use stable references for everything.
		 */
		panels: TPanel[];
		/**
		 * Not reactive, bro. Just default.
		 */
		defaultPanel: TPanel;
	}

	export interface Use<TPanel extends string> {
		View: FC<Omit<View.Props<TPanel>, "control">>;
		Panel: FC<Omit<Panel.Props<TPanel>, "control">>;
		isVisible(name: TPanel): boolean;
		set(name: TPanel): void;
	}
}

export const useView = <TPanel extends string>({
	panels: _,
	defaultPanel,
}: useView.Props<TPanel>): useView.Use<TPanel> => {
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
		} satisfies useView.Use<TPanel>;
	}, []);

	return control;
};
