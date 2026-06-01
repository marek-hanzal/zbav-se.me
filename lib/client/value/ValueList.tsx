import type { ReactNode } from "react";
import type { EntitySchema } from "@/lib/common/schema";
import { Container } from "../container/Container";
import { Group } from "../group/Group";
import { Icon } from "../icon";
import { SpinnerContainer } from "../spinner/SpinnerContainer";
import { Tx } from "../tx/Tx";
import type { Typo } from "../typo/Typo";

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
		textLabelProps?: Typo.PropsEx;
	}

	export type PropsEx<TItem extends EntitySchema.Type> = Omit<
		Props<TItem>,
		"textLabel" | "textEmpty" | "renderFn"
	>;
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
	textLabelProps,
	...props
}: ValueList.Props<TItem>) => {
	return (
		<Container
			data-root="ValueList"
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-inner="default"
			data-ui-round={undefined}
			data-ui-background="default"
			data-ui-border={false}
			data-ui-shadow={false}
			data-ui-flow="vertical"
			data-ui-gap="xs"
			{...props}
		>
			<Container
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-flow="horizontal"
				data-ui-items="center"
				data-ui-justify="space-between"
				data-ui-gap="default"
				data-ui-color="lead"
				{...wrapperProps}
			>
				<Tx
					label={textLabel}
					data-ui-font="normal"
					data-ui-display="block"
					data-ui-color="lead"
					data-ui-text={"sm"}
					{...textLabelProps}
				/>

				{action}
			</Container>

			{textHint ? (
				<Tx
					label={textHint}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-text="xs"
					data-ui-color="icon"
					data-ui-italic={true}
				/>
			) : null}

			{loading ? null : (
				<Group data-ui-shadow={false}>
					{items.map((item) => (
						<Container
							key={item.id}
							data-ui-tone="neutral"
							data-ui-theme="light"
							data-ui-background="default"
							data-ui-border={false}
							data-ui-shadow={false}
							data-ui-round="default"
							data-ui-inner="default"
							data-ui-flow={"horizontal"}
							data-ui-items={"center"}
							data-ui-gap={"default"}
							data-ui-text={"md"}
							className={"px-0"}
						>
							<Icon
								icon={"icon-[solar--forward-2-linear]"}
								data-ui-text={"xl"}
								data-ui-opacity={"4"}
							/>
							{renderFn(item)}
						</Container>
					))}
				</Group>
			)}

			{loading && (
				<SpinnerContainer
					size={"md"}
					data-ui-height="content"
				/>
			)}

			{!loading && items.length === 0 && (
				<Tx
					label={textEmpty}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-opacity="6"
				/>
			)}
		</Container>
	);
};

export type ValueList = typeof ValueList;
