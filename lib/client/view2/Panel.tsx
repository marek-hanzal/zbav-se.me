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
