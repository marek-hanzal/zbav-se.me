import type { EntitySchema } from "@use-pico/common/schema";
import type { ReactNode } from "react";
import { Group } from "../group";
import { Tx } from "../tx/Tx";
import { Container } from "./Container";
import { SpinnerContainer } from "./SpinnerContainer";

export namespace ValueList {
	export interface Props<TItem extends EntitySchema.Type> extends Container.Props {
		/**
		 * Translation label for the list title.
		 */
		textLabel: string;
		/**
		 * Translation label for the empty state.
		 */
		textEmpty: string;
		/**
		 * Translation label for the hint text.
		 */
		textHint?: string;
		/**
		 * Array of items to display.
		 */
		items: TItem[];
		/**
		 * Function to render each item.
		 */
		renderFn(item: TItem): ReactNode;
		/**
		 * Action element to display next to the title.
		 */
		action?: ReactNode;
		loading?: boolean;
		wrapperProps?: Container.Props;
	}

	export type PropsEx<TItem extends EntitySchema.Type> = Partial<Props<TItem>>;
}

export const ValueList = <TItem extends EntitySchema.Type>({
	textLabel,
	textEmpty,
	textHint,
	items,
	renderFn,
	action,
	loading,
	wrapperProps,
	ui,
	...props
}: ValueList.Props<TItem>) => {
	return (
		<Container
			data-root="ValueList[Container]"
			ui={{
				tone: "neutral",
				theme: "light",
				inner: "default",
				round: undefined,
				background: "default",
				border: false,
				shadow: false,
				flow: "vertical",
				gap: "xs",
				...ui,
			}}
			{...props}
		>
			<Container
				data-ui={"ValueList-[Container.label-wrapper]"}
				{...wrapperProps}
				ui={{
					tone: "primary",
					theme: "light",
					flow: "horizontal",
					items: "center",
					justify: "space-between",
					gap: "default",
					color: "lead",
					...wrapperProps?.ui,
				}}
			>
				<Tx
					label={textLabel}
					preset={"label"}
					ui={{
						font: "semibold",
						display: "block",
						color: "lead",
					}}
				/>

				{action}
			</Container>

			{textHint ? (
				<Tx
					label={textHint}
					ui={{
						tone: "neutral",
						theme: "light",
						text: "xs",
						color: "icon",
						italic: true,
					}}
				/>
			) : null}

			{loading ? null : (
				<Group data-ui="ValueList-[Container.content]">
					{items.map((item) => (
						<Container
							key={item.id}
							data-ui="ValueList-[Container.item]"
							ui={{
								tone: "subtle",
								theme: "light",
								background: "default",
								border: false,
								shadow: false,
								round: "default",
								inner: "default",
							}}
						>
							{renderFn(item)}
						</Container>
					))}
				</Group>
			)}

			{loading && (
				<SpinnerContainer
					size={"md"}
					ui={{
						height: "content",
					}}
				/>
			)}

			{!loading && items.length === 0 && (
				<Tx
					label={textEmpty}
					ui={{
						tone: "neutral",
						theme: "light",
						opacity: "6",
					}}
				/>
			)}
		</Container>
	);
};
