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
		onSubmit(value: string): void;
		placeholder: string;
		maxRows?: number;
		loading: boolean;
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
	left,
	inputRef,
	...props
}) => {
	const [message, setMessage] = useState("");
	const areaId = useId();
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

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

			if (props["data-ui-disabled"]) {
				return;
			}

			const trimmed = message.trim();
			if (trimmed.length > 0) {
				onSubmit(trimmed);
				setMessage("");
			}
		}
	};

	return (
		<Container
			data-ui={"ChatInput"}
			data-ui-layout="horizontal-flex"
			data-ui-items="center"
			data-ui-justify="center"
			data-ui-gap="md"
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
				disabled={props["data-ui-disabled"] || loading}
				onChange={(e) => setMessage(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				{...uiInput({
					"data-ui-round": "default",
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

			{loading && cancel ? (
				cancel
			) : (
				<Button
					data-action={"send chat text message"}
					iconEnabled={SendMessageIcon}
					iconProps={{
						"data-ui-text": "2xl",
					}}
					disabled={loading || message.length === 0}
					loading={loading}
					onClick={() => {
						onSubmit(message);
						setMessage("");
					}}
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
			)}
		</Container>
	);
};
