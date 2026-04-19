import type { FC, ReactNode } from "react";
import { isString } from "@/lib/common/is-string";
import { Container } from "../container/Container";
import { Tx } from "../tx/Tx";

/**
 * Badge component with label and value display.
 *
 * @group ui
 */
export namespace LabelValue {
	export interface Props extends Container.Props {
		/**
		 * Translation label for the badge label text.
		 */
		textLabel?: string;
		textLabelProps?: Tx.PropsEx;
		/**
		 * Value text to display in the badge.
		 */
		textValue: ReactNode | null;
		textValueProps?: Tx.PropsEx;
		textEmpty?: string;
		textHint?: string;
		action?: ReactNode;
		wrapperProps?: Container.Props;
	}

	export type PropsEx = Omit<Props, "textValue">;
}

export const LabelValue: FC<LabelValue.Props> = ({
	textLabel,
	textLabelProps,
	textValue,
	textValueProps,
	textEmpty,
	textHint,
	action,
	wrapperProps,
	...props
}) => {
	return (
		<Container
			data-ui={"LabelValue[Container]"}
			data-ui-tone="neutral"
			data-ui-theme="light"
			data-ui-inner="default"
			data-ui-round={undefined}
			data-ui-background="default"
			data-ui-flow="vertical"
			data-ui-gap="xs"
			data-ui-border={false}
			data-ui-shadow={false}
			data-ui-width="full"
			{...props}
		>
			<Container
				data-ui={"LabelValue-[Container.label-wrapper]"}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-flow="horizontal"
				data-ui-items="center"
				data-ui-justify="space-between"
				data-ui-gap="default"
				data-ui-color="lead"
				data-ui-width="full"
				{...wrapperProps}
			>
				<Tx
					label={textLabel}
					preset={"label"}
					data-ui-font="semibold"
					data-ui-color="lead"
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

			{isString(textValue) ? (
				<Tx
					label={textValue}
					data-ui-tone="secondary"
					data-ui-theme="light"
					data-ui-text="default"
					data-ui-truncate={true}
					{...textValueProps}
				/>
			) : (
				textValue
			)}

			{textValue === null ? (
				<Tx
					label={textEmpty}
					data-ui-tone="neutral"
					data-ui-theme="light"
					data-ui-opacity="6"
				/>
			) : null}
		</Container>
	);
};
