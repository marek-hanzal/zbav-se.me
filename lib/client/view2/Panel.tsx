import { Suspense, useMemo } from "react";
import { getRootLogger } from "~/common/log/getRootLogger";
import { Container } from "../container";
import { useRenderLogger } from "../log/useRenderLogger";
import { SpinnerContainer } from "../spinner/SpinnerContainer";
import type { useView } from "./useView";

export namespace Panel {
	export interface Props<TPanel extends string> extends Container.Props {
		name: TPanel;
		control: useView.Use<TPanel>;
	}
}

/**
 * Panel content is snapshotted on visibility changes.
 *
 * Hidden panels intentionally do not react to parent renders.
 * Visible panel content also does not receive parent updates unless visibility changes.
 *
 * Use this only for panel flows where opened content owns its local state
 * or reads live data internally.
 */
export const Panel = <TPanel extends string>({
	name,
	control,
	children,
	...props
}: Panel.Props<TPanel>) => {
	const isVisible = control.isVisible(name);
	useRenderLogger({
		logger: getRootLogger("Panel"),
		name: "Panel",
		meta: {
			name,
		},
	});

	// biome-ignore lint/correctness/useExhaustiveDependencies: Ssst
	const panel = useMemo(() => {
		return (
			<Container
				data-ui={`Panel-${name}`}
				className={isVisible ? undefined : "hidden"}
				data-ui-height={"full"}
				data-ui-scroll={"vertical"}
				{...props}
			>
				<Suspense fallback={<SpinnerContainer />}>{children}</Suspense>
			</Container>
		);
	}, [
		isVisible,
	]);

	return panel;
};
