import { Container } from "@use-pico/client/ui/container";
import { useCls } from "@use-pico/cls";
import { type FC, type KeyboardEventHandler, useLayoutEffect, useRef } from "react";
import { ChatInputCls } from "./ChatInputCls";

export namespace ChatInput {
	export interface Props extends ChatInputCls.Props<Omit<Container.Props, "onSubmit">> {
		value: string;
		onChange(value: string): void;
		onSubmit(value: string): void;
		placeholder: string;
		maxRows?: number;
	}
}

export const ChatInput: FC<ChatInput.Props> = ({
	value,
	onChange,
	onSubmit,
	placeholder,
	maxRows = 6,
	cls = ChatInputCls,
	tweak,
	...props
}) => {
	const { slots } = useCls(cls, tweak);

	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We're reacting to value change
	useLayoutEffect(() => {
		const el = textareaRef.current;
		if (!el) {
			return;
		}

		el.style.height = "auto";

		const lineHeight = parseFloat(getComputedStyle(el).lineHeight || "20");
		const maxHeight = lineHeight * maxRows;

		el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
	}, [
		value,
		maxRows,
	]);

	const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === "Enter" && !e.ctrlKey && !e.metaKey) {
			return;
		}

		if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
			e.preventDefault();

			if (!props.disabled) {
				const trimmed = value.trim();
				if (trimmed.length > 0) {
					onSubmit(trimmed);
				}
			}
		}
	};

	return (
		<Container
			layout={"vertical-centered"}
			items={"center"}
			{...props}
		>
			<div
				className={slots.default({
					slot: {
						default: {
							class: [
								"flex",
								"flex-col",
								"items-center",
								"justify-center",
								"border-2",
								"border-slate-200",
								"bg-slate-100",
								"min-h-0",
								"h-fit",
								"w-full",
							],
							token: [
								"square.md",
								"round.default",
							],
						},
					},
				})}
			>
				<textarea
					ref={textareaRef}
					rows={1}
					value={value}
					disabled={props.disabled}
					onChange={(e) => onChange(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder={placeholder}
					className={slots.input()}
				/>
			</div>
		</Container>
	);
};
