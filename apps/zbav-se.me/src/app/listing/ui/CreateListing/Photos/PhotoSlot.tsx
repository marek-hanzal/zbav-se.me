import { Action, Container, Status, TrashIcon, Tx } from "@use-pico/client";
import {
	type ChangeEvent,
	type FC,
	type KeyboardEvent,
	type SyntheticEvent,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Sheet } from "~/app/sheet/Sheet";
import { anim, useAnim } from "~/app/ui/gsap";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";

function useObjectUrl(file: File | undefined) {
	const [url, setUrl] = useState<string | null>(null);

	useEffect(() => {
		setUrl((prev) => {
			if (prev) {
				URL.revokeObjectURL(prev);
			}
			if (!file) {
				return null;
			}
			return URL.createObjectURL(file);
		});
	}, [
		file,
	]);

	useEffect(() => {
		return () => {
			if (url) {
				URL.revokeObjectURL(url);
			}
		};
	}, [
		url,
	]);

	return url;
}

export namespace PhotoSlot {
	export type Value = File | undefined;
	export type OnChangeFn = (file: Value, slot: number) => void;

	export interface Props extends Omit<Sheet.Props, "slot" | "onChange"> {
		slot: number;
		camera?: boolean;
		value: Value;
		onChange: OnChangeFn;
	}
}

export const PhotoSlot: FC<PhotoSlot.Props> = ({
	slot,
	camera = false,
	value,
	onChange,
	...props
}) => {
	const valueRef = useRef(value);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const trashRef = useRef<HTMLDivElement>(null);
	const src = useObjectUrl(value);

	const [transition, setTransition] = useState<"in" | "out" | "none">("none");

	const pick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const onChangeInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) {
				return;
			}
			onChange(file, slot);
			e.currentTarget.value = "";
		},
		[
			onChange,
			slot,
		],
	);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				pick();
			}
		},
		[
			pick,
		],
	);

	const stop = useCallback((event: SyntheticEvent) => {
		event.preventDefault();
		event.stopPropagation();
	}, []);

	/**
	 * Determine the transition to use.
	 */
	useEffect(() => {
		if (valueRef.current === value) {
			setTransition("none");
		} else if (valueRef.current && !value) {
			setTransition("out");
		} else if (!valueRef.current && value) {
			setTransition("in");
		}

		valueRef.current = value;
	}, [
		value,
	]);

	useAnim(
		() => {
			if (transition === "none") {
				anim.set(trashRef.current, {
					autoAlpha: 0,
					scale: 0.75,
				});
			}
		},
		{
			dependencies: [
				transition,
			],
		},
	);

	/**
	 * Animate trash out.
	 */
	useAnim(
		() => {
			if (transition === "out") {
				anim.to(trashRef.current, {
					autoAlpha: 0,
					scale: 0.75,
					y: -128,
					duration: 0.25,
				});

				anim.timeline({
					defaults: {
						duration: 1.25,
					},
				})
					.to(sheetRef.current, {
						scale: 0.95,
						opacity: 0,
					})
					.to(sheetRef.current, {
						scale: 1,
						opacity: 1,
					});
			}
		},
		{
			dependencies: [
				transition,
			],
		},
	);

	/**
	 * Animate trash in.
	 */
	useAnim(
		() => {
			if (transition === "in") {
				anim.to(trashRef.current, {
					autoAlpha: 1,
					scale: 1,
					y: 0,
					duration: 0.25,
				});
			}
		},
		{
			dependencies: [
				transition,
			],
		},
	);

	return (
		<Container
			ref={containerRef}
			data-ui="PhotoSlot-root"
			position="relative"
			tweak={{
				slot: {
					root: {
						class: [
							"PhotoSlot-root",
							value ? "PhotoSlot-has-value" : "PhotoSlot-empty",
						],
					},
				},
			}}
		>
			<input
				data-ui="PhotoSlot-input"
				ref={inputRef}
				type="file"
				accept="image/*"
				capture={camera ? "environment" : undefined}
				className="sr-only"
				onChange={onChangeInput}
			/>

			<Action
				ref={trashRef}
				iconEnabled={TrashIcon}
				onClick={(e) => {
					stop(e);
					onChange(undefined, slot);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						stop(e);
						onChange(undefined, slot);
					}
				}}
				size={"md"}
				tone={"danger"}
				border={false}
				tweak={{
					slot: {
						root: {
							class: [
								"absolute",
								"top-8",
								"right-1/2",
								"translate-x-1/2",
								"transition-none",
								"z-10",
							],
						},
					},
				}}
			/>

			<Sheet
				ref={sheetRef}
				onClick={pick}
				onKeyDown={onKeyDown}
				style={{
					backgroundImage: `url(${src})`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
				{...props}
			>
				{src ? null : (
					<Status
						icon={PhotoIcon}
						textTitle={
							<Tx
								label={"Upload (placeholder)"}
								font="bold"
								size={"xl"}
								tone={"primary"}
								theme={"light"}
							/>
						}
						tone={"primary"}
					/>
				)}
			</Sheet>
		</Container>
	);
};
