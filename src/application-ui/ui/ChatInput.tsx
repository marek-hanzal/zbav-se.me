import {
	type FC,
	type KeyboardEventHandler,
	type ReactNode,
	type RefCallback,
	useId,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { SendMessageIcon } from "~/application-ui/constant/icon.exports";
import { uiInputFn } from "~/form/fn/uiInputFn";
import { Button } from "~/ui/ui/Button";
import { Container } from "~/ui/ui/Container";

export namespace ChatInput {
	export interface Props extends Omit<Container.Props, "onSubmit" | "onChange"> {
		cancel?: ReactNode;
		onSubmitFn(value: string): Promise<void>;
		placeholder: string;
		maxRows?: number;
		loading: boolean;
		disableInput?: boolean;
		disableSubmit?: boolean;
		left?: ReactNode;
		inputRefFn?: RefCallback<HTMLTextAreaElement>;
		buttonProps?: Button.Props;
	}

	export type PropsEx = Omit<Props, "loading" | "placeholder" | "onSubmitFn">;
}

export const ChatInput: FC<ChatInput.Props> = ({
	cancel,
	onSubmitFn,
	placeholder,
	maxRows = 6,
	loading,
	disableInput = false,
	disableSubmit = false,
	left,
	inputRefFn,
	buttonProps,
	...props
}) => {
	const [message, setMessageFn] = useState("");
	const areaId = useId();
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const value = message.trim();
	const canSubmit = !disableSubmit && value.length > 0;

	const submitFn = () => {
		if (!canSubmit) {
			return;
		}

		onSubmitFn(value);
		setMessageFn("");
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: We're reacting to value change
	useLayoutEffect(() => {
		const el = textareaRef.current;
		if (!el) {
			return;
		}

		const style = getComputedStyle(el);

		const lineHeight = Number.parseFloat(style.lineHeight || "20");
		const paddingTop = Number.parseFloat(style.paddingTop || "0");
		const paddingBottom = Number.parseFloat(style.paddingBottom || "0");
		const borderTop = Number.parseFloat(style.borderTopWidth || "0");
		const borderBottom = Number.parseFloat(style.borderBottomWidth || "0");

		const verticalExtras = paddingTop + paddingBottom + borderTop + borderBottom;
		const maxHeight = lineHeight * maxRows + verticalExtras;

		el.style.height = "0px";
		const next = Math.min(el.scrollHeight, maxHeight);

		el.style.height = `${next}px`;

		el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
	}, [
		message,
		maxRows,
	]);

	const handleKeyDownFn: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
			return;
		}

		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();

			submitFn();
		}
	};

	useLayoutEffect(() => {
		textareaRef.current?.focus();
	}, []);

	return (
		<Container
			data-ui={"ChatInput"}
			data-ui-layout="horizontal-flex"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-tone={"neutral"}
			data-ui-theme={"light"}
			data-ui-width="full"
			data-ui-inner="default"
			data-ui-background={"default"}
			data-ui-border
			data-ui-round={"lg"}
			data-ui-shadow
			{...props}
		>
			{left}

			<textarea
				ref={(element) => {
					textareaRef.current = element;
					inputRefFn?.(element);
				}}
				id={areaId}
				rows={1}
				value={message}
				disabled={disableInput}
				data-ui-disabled={disableInput}
				onChange={(e) => setMessageFn(e.target.value)}
				onKeyDown={handleKeyDownFn}
				placeholder={placeholder}
				{...uiInputFn({
					"data-ui-round": "default",
					"data-ui-border": undefined,
					"data-ui-shadow": false,
					className: [
						"resize-none",
						"outline-none",
						"text-md",
						"leading-5",
						"w-full",
						"min-h-0",
					],
				})}
			/>

			{loading && cancel ? cancel : null}

			<Button
				data-action={"send chat text message"}
				iconEnabled={SendMessageIcon}
				iconProps={{
					"data-ui-text": "2xl",
				}}
				disabled={!canSubmit}
				data-ui-disabled={!canSubmit}
				loading={loading && disableSubmit}
				onClick={submitFn}
				data-ui-justify="center"
				data-ui-items="center"
				data-ui-tone="brand"
				data-ui-theme="light"
				data-ui-square="default"
				data-ui-background={undefined}
				data-ui-border={false}
				data-ui-shadow={false}
				data-ui-color="lead"
				{...buttonProps}
			/>
		</Container>
	);
};
