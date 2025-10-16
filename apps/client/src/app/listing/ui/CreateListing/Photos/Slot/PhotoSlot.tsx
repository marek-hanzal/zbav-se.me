import {
	Action,
	Container,
	Icon,
	SpinnerIcon,
	Status,
	TrashIcon,
	useSetUnset,
} from "@use-pico/client";
import {
	type ChangeEvent,
	type FC,
	type KeyboardEvent,
	type SyntheticEvent,
	useCallback,
	useRef,
	useState,
} from "react";
import { useCreateListingContext } from "~/app/listing/context/useCreateListingContext";
import { Sheet } from "~/app/sheet/Sheet";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { useChangeAnim } from "./useChangeAnim";
import { useObjectUrl } from "./useObjectUrl";
import { useOpacityAnim } from "./useOpacityAnim";
import { useSetAnim } from "./useSetAnim";
import { useUnsetAnim } from "./useUnsetAnim";

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
	const spinnerRef = useRef<HTMLDivElement>(null);
	const src = useObjectUrl(img);

	const sheetX = "150%";
	const sheetTransitionOpacity = 0.5;
	const sheetTransitionScale = 0.95;
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

	useOpacityAnim({
		sheetRef,
		sheetOpacity,
	});

	useSetAnim({
		transition,
		spinnerRef,
		sheetRef,
		trashRef,
		sheetTransitionScale,
		sheetTransitionOpacity,
		sheetX,
		sheetOpacity,
		value,
		setImg,
	});

	useUnsetAnim({
		transition,
		spinnerRef,
		trashRef,
		sheetRef,
		sheetTransitionScale,
		sheetTransitionOpacity,
		sheetX,
		sheetOpacity,
		setImg,
	});

	useChangeAnim({
		transition,
		spinnerRef,
		trashRef,
		sheetRef,
		sheetTransitionScale,
		sheetTransitionOpacity,
		sheetX,
		sheetOpacity,
		setImg,
		value,
	});

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
								"opacity-0",
								"scale-75",
							],
						},
					},
				}}
			/>

			<Icon
				ref={spinnerRef}
				icon={SpinnerIcon}
				size={"xl"}
				tone={"primary"}
				theme={"dark"}
				tweak={{
					slot: {
						root: {
							class: [
								"absolute",
								"top-1/2",
								"left-1/2",
								"-translate-x-1/2",
								"-translate-y-1/2",
								"opacity-0",
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
						textTitle={"Upload (title)"}
						textMessage={
							props.disabled
								? "Upload - disabled (placeholder)"
								: "Upload (placeholder)"
						}
						tone={"primary"}
					/>
				)}
			</Sheet>
		</Container>
	);
};
