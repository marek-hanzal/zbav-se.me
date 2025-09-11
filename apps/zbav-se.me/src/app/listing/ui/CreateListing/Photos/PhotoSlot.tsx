import { useCls } from "@use-pico/cls";
import { type FC, useRef, useState } from "react";
import { PhotoSlotCls } from "./PhotoSlotCls";

export namespace PhotoSlot {
	export interface Props extends PhotoSlotCls.Props {
		slot: number;
		onPick?: (file: File, slot: number) => void;
	}
}

export const PhotoSlot: FC<PhotoSlot.Props> = ({
	cls = PhotoSlotCls,
	tweak,
	slot,
	onPick,
}) => {
	const slots = useCls(cls, tweak, ({ what }) => ({
		variant: what.variant({
			default: slot === 0,
		}),
	}));

	const inputRef = useRef<HTMLInputElement>(null);
	const [src, setSrc] = useState<string | null>(null);

	const openPicker = () => inputRef.current?.click();

	const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		const f = e.target.files?.[0];
		if (!f) return;

		// zahoď předchozí blob, pokud byl
		if (src) URL.revokeObjectURL(src);

		const url = URL.createObjectURL(f);
		setSrc(url);
		onPick?.(f, slot);

		e.currentTarget.value = ""; // dovolí znovu nahrát stejný soubor
	};

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			openPicker();
		}
	};

	return (
		<div
			className={slots.root()}
			onClick={openPicker}
			onKeyDown={onKeyDown}
		>
			<div className={slots.slot()}>
				{src ? (
					<img
						src={src}
						className={slots.img()}
						alt={`Foto ${slot + 1}`}
						style={{
							width: "100%",
							height: "100%",
							objectFit: "cover",
						}}
						draggable={false}
					/>
				) : (
					<span>placeholder</span>
				)}

				<input
					ref={inputRef}
					type="file"
					accept="image/*"
					capture="environment"
					className="sr-only"
					onChange={onChangeInput}
				/>
			</div>
		</div>
	);
};
