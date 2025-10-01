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
	const [img, setImg] = useState(value);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const trashRef = useRef<HTMLDivElement>(null);
	const src = useObjectUrl(img);

	const sheetDuration = 0.15;

	const [transition, setTransition] = useState<
		"in" | "out" | "none" | "update"
	>("none");

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
		if (img === value) {
			setTransition("none");
		} else if (img && !value) {
			setTransition("out");
		} else if (!img && value) {
			setTransition("in");
		} else if (img && value && img !== value) {
			setTransition("update");
		}
	}, [
		value,
		img,
	]);

	useAnim(
		() => {
			if (transition === "none") {
				anim.set(
					trashRef.current,
					img
						? {
								autoAlpha: 1,
								scale: 1,
							}
						: {
								autoAlpha: 0,
								scale: 0.75,
							},
				);
			}
		},
		{
			dependencies: [
				transition,
			],
		},
	);

	/**
	 * Animate out.
	 */
	useAnim(
		() => {
			if (transition === "out") {
				anim.to(trashRef.current, {
					autoAlpha: 0,
					scale: 0.75,
					duration: 0.25,
				});

				anim.timeline({
					defaults: {
						duration: sheetDuration,
					},
				})
					.to(sheetRef.current, {
						scale: 0.98,
						opacity: 0,
						x: "-5%",
						onComplete() {
							setImg(undefined);
						},
					})
					.to(sheetRef.current, {
						scale: 1,
						opacity: 1,
						x: 0,
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
	 * Animate in.
	 */
	useAnim(
		() => {
			if (transition === "in") {
				anim.to(trashRef.current, {
					autoAlpha: 1,
					scale: 1,
					duration: 0.25,
				});

				anim.timeline({
					defaults: {
						duration: sheetDuration,
					},
				})
					.to(sheetRef.current, {
						scale: 0.98,
						opacity: 0,
						x: "5%",
						onComplete() {
							setImg(value);
						},
					})
					.to(sheetRef.current, {
						scale: 1,
						opacity: 1,
						x: 0,
					});
			}
		},
		{
			dependencies: [
				transition,
				value,
			],
		},
	);

	useAnim(
		() => {
			if (transition === "update") {
				anim.timeline({
					defaults: {
						duration: sheetDuration,
					},
				})
					.to(sheetRef.current, {
						scale: 0.95,
						opacity: 0,
						x: "25%",
						onComplete() {
							setImg(value);
						},
					})
					.to(sheetRef.current, {
						scale: 1,
						opacity: 1,
						x: 0,
					});
			}
		},
		{
			dependencies: [
				transition,
				value,
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
								img ? "opacity-0" : "opacity-100",
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
