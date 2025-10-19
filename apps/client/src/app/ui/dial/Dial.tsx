import {
	Badge,
	Container,
	Icon,
	Tx,
	Typo,
	useDoubleTap,
} from "@use-pico/client";
import { tvc } from "@use-pico/cls";
import type { FC, RefObject } from "react";
import { Item } from "~/app/ui/dial/Item";
import { BackspaceIcon } from "~/app/ui/icon/BackspaceIcon";
import { ClearIcon } from "~/app/ui/icon/ClearIcon";

const digit = (current: string, digit: number | string, limit = 8): string => {
	let value = `${current}${digit}`.replace(/^0+(?=\d)/, "");
	if (value[0] === ".") {
		value = value.slice(1);
	}
	return value.length > limit ? value.slice(-limit) : value;
};

const icons = {
	0: "icon-[mynaui--zero-solid]",
	1: "icon-[mynaui--one-solid]",
	2: "icon-[mynaui--two-solid]",
	3: "icon-[mynaui--three-solid]",
	4: "icon-[mynaui--four-solid]",
	5: "icon-[mynaui--five-solid]",
	6: "icon-[mynaui--six-solid]",
	7: "icon-[mynaui--seven-solid]",
	8: "icon-[mynaui--eight-solid]",
	9: "icon-[mynaui--nine-solid]",
} as const;

export namespace Dial {
	export interface Props {
		ref?: RefObject<HTMLDivElement | null>;
		value: number | undefined;
		onChange: (value: number | undefined) => void;
	}
}

export const Dial: FC<Dial.Props> = ({ ref, value, onChange }) => {
	const { onTouchStart } = useDoubleTap({
		onDoubleTap() {
			onChange(undefined);
		},
		delay: 250,
	});

	return (
		<Container
			ref={ref}
			layout={"vertical-header-content"}
			gap={"sm"}
		>
			<Badge
				tone={"primary"}
				theme={"light"}
				size={"xl"}
				tweak={{
					slot: {
						root: {
							class: [
								"inline-flex",
								"flex-row",
								"items-center",
								"justify-between",
								"w-full",
							],
							token: [
								"round.lg",
								"tone.secondary.light.border",
								"tone.secondary.light.shadow",
							],
						},
					},
				}}
			>
				{value ? (
					<Typo
						label={value}
						size={"xl"}
						font={"bold"}
						display={"block"}
					/>
				) : (
					<Tx
						label={"Price (placeholder)"}
						size={"xl"}
						font={"bold"}
						display={"block"}
					/>
				)}

				<Icon
					icon={BackspaceIcon}
					tone="secondary"
					theme="light"
					disabled={!value}
					onClick={() => {
						const change = value?.toString().slice(0, -1);
						onChange(change ? parseFloat(change) : undefined);
					}}
					onTouchStart={onTouchStart}
				/>
			</Badge>

			<div
				className={tvc([
					"grid",
					"grid-cols-3",
					"gap-2",
					"place-items-center",
				])}
			>
				{Array.from({
					length: 9,
				}).map((_, index) => (
					<Item
						key={`price-${index + 1}`}
						icon={icons[(index + 1) as keyof typeof icons]}
						onClick={() => {
							onChange(
								parseFloat(
									digit(
										value ? value.toString() : "",
										index + 1,
									),
								),
							);
						}}
						disabled={false}
					/>
				))}

				<Item
					icon={"icon-[fluent--comma-20-filled]"}
					disabled={!value || value.toString().includes(".")}
					onClick={() => {
						onChange(
							parseFloat(
								digit(value ? value.toString() : "", "."),
							),
						);
					}}
				/>

				<Item
					icon={icons[0]}
					disabled={false}
					onClick={() => {
						onChange(
							parseFloat(digit(value ? value.toString() : "", 0)),
						);
					}}
				/>

				<Item
					icon={ClearIcon}
					disabled={!value}
					onClick={() => {
						onChange(undefined);
					}}
				/>
			</div>
		</Container>
	);
};
