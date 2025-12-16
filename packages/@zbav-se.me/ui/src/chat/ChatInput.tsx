import { PlusIcon } from "@use-pico/client/icon";
import { BottomSheet } from "@use-pico/client/ui/bottom-sheet";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { tvc, useCls } from "@use-pico/cls";
import {
	type FC,
	type KeyboardEventHandler,
	type ReactNode,
	useId,
	useLayoutEffect,
	useRef,
} from "react";
import { SendMessageIcon } from "../icon";
import { ChatInputCls } from "./ChatInputCls";

export namespace ChatInput {
	export namespace Menu {
		export type State = [
			boolean,
			(value: boolean | ((value: boolean) => boolean)) => void,
		];

		export interface Props {
			state: State;
			content: ReactNode;
			props?: BottomSheet.PropsEx;
		}
	}

	export interface Props
		extends ChatInputCls.Props<Omit<Container.Props, "onSubmit" | "onChange">> {
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
	cls = ChatInputCls,
	tweak,
	ui,
	...props
}) => {
	const { slots } = useCls(cls, tweak);

	const areaId = useId();
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const [isMenu, setIsMenu] = menu?.state || [
		false,
		(value) => !value,
	];

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
						onClick={() => setIsMenu((prev) => !prev)}
						ui={{
							tone: "link",
						}}
					/>

					<BottomSheet
						data-ui={"ChatInput-BottomSheet-menu"}
						isOpen={isMenu}
						onClose={() => setIsMenu(false)}
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

			<div
				className={tvc([
					"flex",
					"flex-col",
					"items-center",
					"justify-center",
					"w-full",
				])}
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
						id={areaId}
						rows={1}
						value={value}
						disabled={ui?.disabled}
						onChange={(e) => onChange(e.target.value)}
						onKeyDown={handleKeyDown}
						placeholder={placeholder}
						className={slots.input()}
					/>
				</div>
			</div>

			<Button
				data-ui={"ChatInput-Button-send"}
				iconEnabled={SendMessageIcon}
				disabled={loading || value.length === 0}
				loading={loading}
				onClick={() => {
					onSubmit(value);
					onChange("");
				}}
			/>
		</Container>
	);
};
