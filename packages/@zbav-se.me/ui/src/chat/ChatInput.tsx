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

	export interface Props extends ChatInputCls.Props<Omit<Container.Props, "onSubmit">> {
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

			if (props.disabled) {
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
			layout={"horizontal-flex"}
			gap={"md"}
			tone={"unset"}
			theme={"unset"}
			{...props}
		>
			<div
				className={tvc([
					"flex",
					"flex-row",
					"gap-2",
					"items-end",
					"justify-center",
					"w-full",
				])}
			>
				{menu ? (
					<>
						<Button
							iconEnabled={PlusIcon}
							tone={"link"}
							onClick={() => setIsMenu((prev) => !prev)}
						/>

						<BottomSheet
							isOpen={isMenu}
							onClose={() => setIsMenu(false)}
							noClose
							{...menu.props}
						>
							<Container
								layout={"vertical-flex"}
								gap={"md"}
								square={"md"}
								tone={"unset"}
								theme={"unset"}
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
							disabled={props.disabled}
							onChange={(e) => onChange(e.target.value)}
							onKeyDown={handleKeyDown}
							placeholder={placeholder}
							className={slots.input()}
						/>
					</div>
				</div>

				<Button
					iconEnabled={SendMessageIcon}
					iconProps={{
						size: "md",
					}}
					tone={"primary"}
					theme={"light"}
					disabled={loading || value.length === 0}
					loading={loading}
					onClick={() => {
						onSubmit(value);
						onChange("");
					}}
				/>
			</div>
		</Container>
	);
};
