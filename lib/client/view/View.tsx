import { type PropsWithChildren, type ReactNode, Suspense } from "react";
import { entriesOf } from "@/lib/common/entries-of";
import { Container } from "../container/Container";
import { SpinnerContainer } from "../spinner";
import type { StateType } from "../type/StateType";

export namespace View {
	export type View<TProps = {}> = PropsWithChildren<TProps> & {
		scroller?: "vertical" | "horizontal" | false;
	};

	export type Views<TView extends string, TProps = {}> = Record<TView, View<TProps>>;

	export namespace Children {
		export interface Props {
			content: ReactNode;
		}

		export type RenderFn = (props: Props) => ReactNode;
	}

	export interface Props<TView extends string, TProps = {}> {
		state: StateType.State<TView>;
		views: Views<TView, TProps>;
		children?: Children.RenderFn;
	}
}

export const View = <TView extends string, TProps = {}>({
	state,
	views,
	children = ({ content }) => content,
}: View.Props<TView, TProps>) => {
	return children({
		content: entriesOf(views).map(([key, { scroller = "vertical", children }]) => {
			return (
				<Container
					key={key}
					data-ui-scroll={scroller === false ? undefined : scroller}
					data-ui-height="full"
					data-ui-width="full"
					className={state.value === key ? undefined : "hidden"}
				>
					<Suspense fallback={<SpinnerContainer />}>{children}</Suspense>
				</Container>
			);
		}),
	});
};
