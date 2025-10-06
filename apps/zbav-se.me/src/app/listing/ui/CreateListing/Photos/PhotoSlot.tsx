import {
	Action,
	Container,
	Status,
	TrashIcon,
	Tx,
	useSetUnset,
} from "@use-pico/client";
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
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
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
	export type OnChangeFn = (slot: number, file: Value) => void;

	export interface Props extends Omit<Sheet.Props, "slot" | "onChange"> {
		slot: number;
		camera?: boolean;
	}
}

export const PhotoSlot: FC<PhotoSlot.Props> = ({
	slot,
	camera = false,
	...props
}) => {
	const useCreateListingStore = useCreateListingContext();
	const setPhoto = useCreateListingStore((store) => store.setPhoto);
	const value = useCreateListingStore((store) => store.photos)[slot];

	const [img, setImg] = useState(value);
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const trashRef = useRef<HTMLDivElement>(null);
	const src = useObjectUrl(img);

	const sheetDuration = 0.25;
	const sheetX = "50%";
	const sheetOpacity = props.disabled ? 0.5 : 1;

	const [, transition] = useSetUnset({
		value,
	});

	const pick = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const onChangeInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) {
				return;
			}
			setPhoto(slot, file);
			e.currentTarget.value = "";
		},
		[
			setPhoto,
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

	useAnim(
		() => {
			if (transition === "mount") {
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

				anim.set(sheetRef.current, {
					opacity: sheetOpacity,
				});
			}
		},
		{
			dependencies: [
				transition,
			],
		},
	);

	useAnim(
		() => {
			anim.to(sheetRef.current, {
				opacity: sheetOpacity,
			});
		},
		{
			dependencies: [
				sheetOpacity,
			],
		},
	);

	/**
	 * Animate out.
	 */
	useAnim(
		() => {
			if (transition === "unset") {
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
						x: `-${sheetX}`,
						onComplete() {
							setImg(undefined);
						},
					})
					.set(sheetRef.current, {
						x: sheetX,
					})
					.to(sheetRef.current, {
						scale: 1,
						opacity: sheetOpacity,
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
			if (transition === "set") {
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
						x: sheetX,
						onComplete() {
							setImg(value);
						},
					})
					.set(sheetRef.current, {
						x: `-${sheetX}`,
					})
					.to(sheetRef.current, {
						scale: 1,
						opacity: sheetOpacity,
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
			if (transition === "change") {
				anim.timeline({
					defaults: {
						duration: sheetDuration,
					},
				})
					.to(sheetRef.current, {
						scale: 0.95,
						opacity: 0,
						x: `-${sheetX}`,
						onComplete() {
							setImg(value);
						},
					})
					.set(sheetRef.current, {
						x: sheetX,
					})
					.to(sheetRef.current, {
						scale: 1,
						opacity: sheetOpacity,
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
					setPhoto(slot, undefined);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						stop(e);
						setPhoto(slot, undefined);
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
