import { type FC, useEffect, useState } from "react";
import { tvc } from "@/lib/client/cls";
import { Container } from "@/lib/client/container";
import { Icon } from "@/lib/client/icon";
import { BackspaceIcon } from "../icon/BackspaceIcon";
import { ClearIcon } from "../icon/ClearIcon";
import { Item } from "./Item";
import { Value } from "./Value";

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
	export interface Props extends Omit<Container.Props, "onChange"> {
		value: number | undefined;
		onChange(value: number | undefined): void;
		placeholder: string;
		allowDecimals: boolean;
		max?: number;
	}
}

export const Dial: FC<Dial.Props> = ({ value, onChange, placeholder, allowDecimals, ...props }) => {
	const [internalValue, setInternalValue] = useState<string | undefined>(
		value !== undefined ? String(value) : undefined,
	);

	useEffect(() => {
		setInternalValue(value !== undefined ? String(value) : undefined);
	}, [
		value,
	]);

	const handleChange = (nextValue: string | undefined) => {
		setInternalValue(nextValue);

		if (!nextValue) {
			onChange(undefined);
			return;
		}

		onChange(Number.parseFloat(nextValue));
	};

	return (
		<Container
			data-ui={"Dial"}
			data-ui-layout="vertical-header-content"
			data-ui-height="full"
			data-ui-gap="sm"
			{...props}
		>
			<Container
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-flow="horizontal"
				data-ui-justify="space-between"
				data-ui-items="center"
				data-ui-inner="lg"
				data-ui-background="default"
				data-ui-shadow
				data-ui-border
				data-ui-round="default"
			>
				<Value
					value={internalValue}
					placeholder={placeholder}
				/>

				<Icon
					icon={BackspaceIcon}
					data-action={"dial backspace"}
					onClick={() => {
						handleChange(internalValue?.slice(0, -1) || undefined);
					}}
					data-ui-tone="secondary"
					data-ui-theme="light"
					data-ui-disabled={!internalValue}
					data-ui-text="2xl"
				/>
			</Container>

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
						key={`price-${
							// biome-ignore lint/suspicious/noArrayIndexKey: Ssst!
							index + 1
						}`}
						icon={icons[(index + 1) as keyof typeof icons]}
						data-action={`dial digit ${index + 1}`}
						onClick={() => {
							handleChange(digit(internalValue || "", index + 1));
						}}
						disabled={false}
					/>
				))}

				<Item
					icon={"icon-[fluent--comma-20-filled]"}
					data-action={"dial decimal"}
					disabled={!allowDecimals || !internalValue || internalValue.includes(".")}
					onClick={() => {
						handleChange(digit(internalValue || "", "."));
					}}
				/>

				<Item
					icon={icons[0]}
					data-action={"dial digit 0"}
					disabled={false}
					onClick={() => {
						handleChange(digit(internalValue || "", 0));
					}}
				/>

				<Item
					icon={ClearIcon}
					data-action={"dial clear"}
					disabled={!internalValue}
					onClick={() => {
						handleChange(undefined);
					}}
				/>
			</div>
		</Container>
	);
};
