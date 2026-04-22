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
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { uiInput } from "@/lib/client/form";
import { SendMessageIcon } from "../icon";

export namespace ChatInput {
	export interface Props extends Omit<Container.Props, "onSubmit" | "onChange"> {
		cancel?: ReactNode;
		onSubmit(value: string): Promise<void>;
		placeholder: string;
		maxRows?: number;
		loading: boolean;
		disableInput?: boolean;
		disableSubmit?: boolean;
		left?: ReactNode;
		inputRef?: RefCallback<HTMLTextAreaElement>;
	}

	export type PropsEx = Omit<Props, "loading" | "placeholder" | "onSubmit">;
}

export const ChatInput: FC<ChatInput.Props> = ({
	cancel,
	onSubmit,
	placeholder,
	maxRows = 6,
	loading,
	disableInput = false,
	disableSubmit = false,
	left,
	inputRef,
	...props
}) => {
	const [message, setMessage] = useState("");
	const areaId = useId();
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const value = message.trim();
	const canSubmit = !disableSubmit && value.length > 0;

	const submit = () => {
		if (!canSubmit) {
			return;
		}

		onSubmit(value);
		setMessage("");
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

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
			return;
		}

		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();

			submit();
		}
	};

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
					inputRef?.(element);
				}}
				id={areaId}
				rows={1}
				value={message}
				disabled={disableInput}
				data-ui-disabled={disableInput}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				{...uiInput({
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
				onClick={submit}
				data-ui-justify="center"
				data-ui-items="center"
				data-ui-tone="brand"
				data-ui-theme="light"
				data-ui-square="default"
				data-ui-background={undefined}
				data-ui-border={false}
				data-ui-shadow={false}
				data-ui-color="lead"
			/>
		</Container>
	);
};
