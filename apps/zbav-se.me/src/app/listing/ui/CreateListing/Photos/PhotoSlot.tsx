import { Action, Sheet, Status, TrashIcon, Tx } from "@use-pico/client";
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
import { Container } from "~/app/ui/container/Container";
import { PhotoIcon } from "~/app/ui/icon/PhotoIcon";

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

	const rootRef = useRef<HTMLDivElement>(null);

	// useAnim(
	// 	() => {
	// 		anim.from(rootRef.current, {
	// 			scrollTrigger: {
	// 				trigger: rootRef.current,
	// 				start: "top bottom",
	// 				end: "bottom top",
	// 				toggleActions: "restart pause restart pause",
	// 				scrub: true,
	// 				markers: true,
	// 			},
	// 			x: 64,
	// 			rotation: 90,
	// 			opacity: 0,
	// 			duration: 0.5,
	// 		});
	// 	},
	// 	{
	// 		scope: rootRef,
	// 	},
	// );

	return (
		<Container
			data-ui="PhotoSlot-root"
			position="relative"
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

			{src && (
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
					tweak={({ what }) => ({
						slot: what.slot({
							root: what.css([
								"absolute",
								"top-8",
								"right-1/2",
								"translate-x-1/2",
							]),
						}),
					})}
				/>
			)}

			<Sheet
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
