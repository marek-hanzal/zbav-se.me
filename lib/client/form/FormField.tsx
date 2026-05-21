import type { FC, ReactNode, Ref } from "react";
import { useId } from "react";
import { Container } from "../container/Container";
import { Typo } from "../typo/Typo";
import { FormError } from "./FormError";
import { uiInput } from "./uiInput";

export namespace FormField {
	export type FieldError = any;

	export namespace Render {
		export interface Props extends uiInput.Component<{}> {
			ref?: Ref<any>;
			disabled: boolean;
			id: string;
			meta?: FormError.Meta;
			name?: string;
			required: boolean;
		}

		export type RenderFn = (props: Props) => ReactNode;
	}

	export interface Props extends Omit<Container.Props, "children"> {
		ref?: Ref<any>;
		id?: string;
		label?: ReactNode;
		hint?: ReactNode;
		name?: string;
		required?: boolean;
		disabled?: boolean;
		meta?: FormError.Meta;
		children?: Render.RenderFn;
	}
}

export const FormField: FC<FormField.Props> = (props) => {
	const {
		ref,
		id,
		label,
		hint,
		name,
		required = false,
		disabled = false,
		meta,
		children = ({ className, ...props }) => (
			<input
				{...uiInput({
					className,
				})}
				{...props}
			/>
		),
		...rest
	} = props;

	const localId = useId();

	const isError = meta?.isTouched && meta.errors && meta.errors.length > 0;

	const tone = isError ? "danger" : required ? "brand" : "neutral";
	const theme = "light";

	return (
		<Container
			data-ui="FormField"
			data-ui-tone="neutral"
			data-ui-theme={theme}
			data-ui-layout="vertical-flex"
			data-ui-items="start"
			data-ui-justify="center"
			data-ui-gap="xs"
			data-ui-width="full"
			{...rest}
		>
			{label || hint ? (
				<Container
					data-ui-layout="vertical-flex"
					data-ui-gap="xs"
				>
					{label ? (
						<Typo
							label={label}
							data-ui-tone={tone}
							data-ui-theme={theme}
							data-ui-text="md"
							data-ui-font="normal"
							data-ui-color="lead"
						/>
					) : null}

					{hint ? (
						<Typo
							label={hint}
							data-ui-tone="subtle"
							data-ui-text="md"
							data-ui-color="lead"
							data-ui-italic
						/>
					) : null}
				</Container>
			) : null}

			{children({
				disabled,
				id: id ?? localId,
				meta,
				name,
				ref,
				required,
				"data-ui-tone": "neutral",
				"data-ui-theme": theme,
				"data-ui-width": "full",
				className: [],
			})}

			<FormError meta={meta} />
		</Container>
	);
};
