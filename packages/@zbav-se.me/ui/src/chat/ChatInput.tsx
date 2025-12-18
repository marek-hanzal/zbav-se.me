import { PlusIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { uiInput } from "@use-pico/client/ui/form";
import type { StateType } from "@use-pico/common/type";
import {
	type FC,
	type KeyboardEventHandler,
	type ReactNode,
	useId,
	useLayoutEffect,
	useRef,
} from "react";
import { SendMessageIcon } from "../icon";

export namespace ChatInput {
	export namespace Menu {
		export interface Props {
			state: StateType.State<boolean>;
			content: ReactNode;
			props?: BottomSheet.PropsEx;
		}
	}

	export interface Props extends Omit<Container.Props, "onSubmit" | "onChange"> {
		value: string;
		onChange(value: string): void;
		onSubmit(value: string): void;
		placeholder: string;
		maxRows?: number;
		loading: boolean;
		menu?: Menu.Props;
	}
}

export const ChatInput: FC<ChatInput.Props> = ({
	value,
	onChange,
	onSubmit,
	placeholder,
	maxRows = 6,
	loading,
	menu,
	ui,
	...props
}) => {
	const areaId = useId();
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: We're reacting to value change
	useLayoutEffect(() => {
		const el = textareaRef.current;
		if (!el) {
			return;
		}

		const cs = getComputedStyle(el);

		const lineHeight = Number.parseFloat(cs.lineHeight || "20");
		const paddingTop = Number.parseFloat(cs.paddingTop || "0");
		const paddingBottom = Number.parseFloat(cs.paddingBottom || "0");
		const borderTop = Number.parseFloat(cs.borderTopWidth || "0");
		const borderBottom = Number.parseFloat(cs.borderBottomWidth || "0");

		const verticalExtras = paddingTop + paddingBottom + borderTop + borderBottom;
		const maxHeight = lineHeight * maxRows + verticalExtras;

		el.style.height = "0px";
		const next = Math.min(el.scrollHeight, maxHeight);

		el.style.height = `${next}px`;

		el.style.overflowY = el.scrollHeight > maxHeight ? "auto" : "hidden";
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

			if (ui?.disabled) {
				return;
			}

			const trimmed = value.trim();
			if (trimmed.length > 0) {
				onSubmit(trimmed);
				onChange("");
			}
		}
	};

	return (
		<Container
			data-ui={"ChatInput-Container"}
			ui={{
				layout: "horizontal-flex",
				items: "center",
				justify: "center",
				gap: "md",
				...ui,
			}}
			{...props}
		>
			{menu ? (
				<>
					<Button
						data-ui={"ChatInput-Button-menu"}
						iconEnabled={PlusIcon}
						onClick={() => menu.state.set((prev) => !prev)}
						ui={{
							tone: "link",
						}}
					/>

					<BottomSheet
						data-ui={"ChatInput-BottomSheet-menu"}
						isOpen={menu.state.value}
						onClose={() => menu.state.set(false)}
						{...menu.props}
					>
						<Container
							data-ui={"ChatInput-BottomSheet-Container"}
							ui={{
								layout: "vertical-flex",
								gap: "md",
								inner: "default",
							}}
						>
							{menu.content}
						</Container>
					</BottomSheet>
				</>
			) : null}

			<textarea
				ref={textareaRef}
				id={areaId}
				rows={1}
				value={value}
				disabled={ui?.disabled}
				onChange={(e) => onChange(e.target.value)}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				{...uiInput({
					ui: {
						round: "default",
					},
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

			<Button
				data-ui={"ChatInput-Button-send"}
				iconEnabled={SendMessageIcon}
				iconProps={{
					ui: {
						text: "xl",
					},
				}}
				disabled={loading || value.length === 0}
				loading={loading}
				onClick={() => {
					onSubmit(value);
					onChange("");
				}}
				ui={{
					justify: "center",
					items: "center",
					tone: "brand",
					theme: "light",
					square: "default",
				}}
			/>
		</Container>
	);
};
