import { Action, Status, TrashIcon, Tx } from "@use-pico/client";
import { useCls } from "@use-pico/cls";
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
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";
import { PhotoSlotCls } from "./PhotoSlotCls";

function useObjectUrl(file: File | null) {
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
	export type Value = File | null;
	export type OnChangeFn = (file: Value, slot: number) => void;

	export interface Props extends PhotoSlotCls.Props {
		slot: number;
		disabled?: boolean;
		camera?: boolean;
		value: Value;
		onChange: OnChangeFn;
	}
}

export const PhotoSlot: FC<PhotoSlot.Props> = ({
	slot,
	disabled,
	camera = false,
	cls = PhotoSlotCls,
	tweak,
	value,
	onChange,
}) => {
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			default: false,
			disabled,
		}),
	}));

	const inputRef = useRef<HTMLInputElement>(null);
	const src = useObjectUrl(value);

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

	return (
		<div className={slots.root()}>
			<div
				className={slots.slot()}
				onClick={pick}
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
					<Status
						icon={PhotoIcon}
						textTitle={
							<Tx
								label={"Upload (placeholder)"}
								font="bold"
								size={"xl"}
								tone={"link"}
								theme={"light"}
							/>
						}
						tone={"link"}
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
					<div className="absolute top-8 right-1/2 translate-x-1/2">
						<Action
							iconEnabled={TrashIcon}
							onClick={(e) => {
								stop(e);
								onChange(null, slot);
							}}
							onKeyDown={(e) => {
								if (e.key === "Enter" || e.key === " ") {
									stop(e);
									onChange(null, slot);
								}
							}}
							size={"md"}
							tone={"danger"}
							border={false}
						/>
					</div>
				)}
			</div>
		</div>
	);
};
