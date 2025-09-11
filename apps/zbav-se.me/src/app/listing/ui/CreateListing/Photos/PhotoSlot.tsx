import { Action, TrashIcon, Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
import {
	type ChangeEvent,
	type FC,
	type KeyboardEvent,
	useCallback,
	useRef,
	useState,
} from "react";
import { PhotoSlotCls } from "./PhotoSlotCls";

export namespace PhotoSlot {
	export interface Props extends PhotoSlotCls.Props {
		slot: number;
		camera?: boolean;
		onPick?: (file: File | null, slot: number) => void;
	}
}

export const PhotoSlot: FC<PhotoSlot.Props> = ({
	slot,
	camera = false,
	cls = PhotoSlotCls,
	tweak,
	onPick,
}) => {
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			default: slot === 0,
		}),
	}));

	const inputRef = useRef<HTMLInputElement>(null);
	const [src, setSrc] = useState<string | null>(null);

	const openPicker = useCallback(() => {
		inputRef.current?.click();
	}, []);

	const onChangeInput = useCallback(
		(e: ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) {
				return;
			}
			if (src) {
				URL.revokeObjectURL(src);
			}
			const url = URL.createObjectURL(file);
			setSrc(url);
			onPick?.(file, slot);
			e.currentTarget.value = "";
		},
		[
			src,
			onPick,
			slot,
		],
	);

	const clear = useCallback(() => {
		if (src) {
			URL.revokeObjectURL(src);
		}
		setSrc(null);
		onPick?.(null, slot);
	}, [
		src,
		onPick,
		slot,
	]);

	const onKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "Enter" || e.key === " ") {
				e.preventDefault();
				openPicker();
			}
		},
		[
			openPicker,
		],
	);

	const stop = useCallback((e: any) => {
		e.preventDefault();
		e.stopPropagation();
		if (typeof e.stopImmediatePropagation === "function") {
			e.stopImmediatePropagation();
		}
	}, []);

	return (
		<div className={slots.root()}>
			<div
				className={slots.slot()}
				onClick={openPicker}
				onKeyDown={onKeyDown}
			>
				{src ? (
					<img
						src={src}
						alt={`Foto ${slot + 1}`}
						className={slots.img?.()}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
						draggable={false}
					/>
				) : (
					<Tx
						label={"Upload (placeholder)"}
						font="bold"
						size={"xl"}
						tone={"primary"}
						theme={"light"}
					/>
				)}

				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					capture={camera ? "environment" : undefined}
					className="sr-only"
					onChange={onChangeInput}
				/>

				{src && (
					<div className="absolute top-8 right-1/2">
						<Action
							iconEnabled={TrashIcon}
							onMouseDown={stop}
							onTouchStart={stop}
							onClick={(e) => {
								stop(e);
								clear();
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									stop(e);
									clear();
								}
							}}
							size={"md"}
							tone={"neutral"}
							border={false}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
