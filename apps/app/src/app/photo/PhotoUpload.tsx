import {
	Action,
	Container,
	Icon,
	SpinnerIcon,
	Status,
	TrashIcon,
} from "@use-pico/client";
import { PhotoIcon, Sheet } from "@zbav-se.me/ui";
import src from "gsap/src";
import { type FC, type SyntheticEvent, useCallback, useRef } from "react";

export namespace PhotoUpload {
	export type Value = string | undefined;
	export type OnChangeFn = (uploadId: Value) => void;

	export interface Props extends Omit<Sheet.Props, "slot" | "onChange"> {
		camera?: boolean;
		value: Value;
		onChange: OnChangeFn;
	}
}

export const PhotoUpload: FC<PhotoUpload.Props> = ({
	camera = false,
	value,
	onChange,
	...props
}) => {
	const inputRef = useRef<HTMLInputElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const sheetRef = useRef<HTMLDivElement>(null);
	const trashRef = useRef<HTMLDivElement>(null);
	const spinnerRef = useRef<HTMLDivElement>(null);

	const stop = useCallback((event: SyntheticEvent) => {
		event.preventDefault();
		event.stopPropagation();
	}, []);

	// const onChangeInput = useCallback(
	// 	(e: ChangeEvent<HTMLInputElement>) => {
	// 		const file = e.target.files?.[0];
	// 		if (!file) {
	// 			return;
	// 		}
	// 		setPhoto(slot, file);
	// 		e.currentTarget.value = "";
	// 	},
	// 	[
	// 		setPhoto,
	// 		slot,
	// 	],
	// );

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
				// onChange={onChangeInput}
			/>

			<Action
				ref={trashRef}
				iconEnabled={TrashIcon}
				onClick={(e) => {
					stop(e);
					onChange(undefined);
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						stop(e);
						onChange(undefined);
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
				theme={"light"}
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
				// onClick={pick}
				// onKeyDown={onKeyDown}
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
						iconProps={{
							size: "2xl",
						}}
						textTitle={"Upload (title)"}
						titleProps={{
							size: "2xl",
						}}
						textMessage={
							props.disabled
								? "Upload - disabled (placeholder)"
								: "Listing - upload photo (placeholder)"
						}
						messageProps={{
							size: "xl",
						}}
						tone={"primary"}
					/>
				)}
			</Sheet>
		</Container>
	);
};
