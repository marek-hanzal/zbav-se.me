import { Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { tvc } from "@use-pico/cls";
import type { FC } from "react";
import { BackspaceIcon } from "../icon/BackspaceIcon";
import { ClearIcon } from "../icon/ClearIcon";
import { Item } from "./Item";

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
	export interface Props extends Container.Props {
		value: string | undefined;
		onChange: (value: string | undefined) => void;
	}
}

export const Dial: FC<Dial.Props> = ({ ref, value, onChange, ...props }) => {
	return (
		<Container
			ui={"Dial-Container"}
			layout={"vertical-header-content"}
			height={"fit"}
			gap={"sm"}
			{...props}
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
								"round.default",
								"tone.primary.light.border",
								"tone.primary.light.shadow",
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
						onChange(value?.slice(0, -1) || undefined);
					}}
				/>
			</Badge>

			<div
				className={tvc([
					"grid",
					"grid-cols-3",
					"gap-2",
					"place-items-center",
					"min-h-0",
				])}
			>
				{Array.from({
					length: 9,
				}).map((_, index) => (
					<Item
						key={`price-${index + 1}`}
						icon={icons[(index + 1) as keyof typeof icons]}
						onClick={() => {
							onChange(digit(value || "", index + 1));
						}}
						disabled={false}
					/>
				))}

				<Item
					icon={"icon-[fluent--comma-20-filled]"}
					disabled={!value || value.includes(".")}
					onClick={() => {
						onChange(digit(value || "", "."));
					}}
				/>

				<Item
					icon={icons[0]}
					disabled={false}
					onClick={() => {
						onChange(digit(value || "", 0));
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
