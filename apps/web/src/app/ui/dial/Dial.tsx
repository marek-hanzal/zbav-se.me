import {
	Badge,
	Container,
	type ContainerCls,
	Icon,
	Tx,
	Typo,
} from "@use-pico/client";
import { type Cls, tvc } from "@use-pico/cls";
import { type FC, type RefObject, useMemo } from "react";
import { CurrencySnapper } from "~/app/ui/currency/CurrencySnapper";
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
		locale: string;
		value: string | undefined;
		onChange: (value: string | undefined) => void;
		onChangeCurrency: (currency: string) => void;
		defaultCurrency?: string;
		availableCurrencies?: readonly string[];
	}
}

export const Dial: FC<Dial.Props> = ({
	ref,
	locale,
	value,
	onChange,
	onChangeCurrency,
	defaultCurrency,
	availableCurrencies,
}) => {
	/**
	 * Strange, but necessary to prevent PriceSnapper re-renders which is computing
	 * currency list on every render.
	 */
	const currencyTweak: Cls.TweaksOf<ContainerCls> = useMemo(
		() => ({
			slot: {
				root: {
					class: [
						"w-1/2",
					],
				},
			},
		}),
		[],
	);

	return (
		<Container
			ref={ref}
			layout={"vertical-header-content"}
			gap={"sm"}
		>
			<div
				className={tvc([
					"flex",
					"flex-row",
					"items-center",
					"justify-between",
					"gap-2",
					"w-full",
				])}
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
							onChange(value?.slice(0, -1) || undefined);
						}}
					/>
				</Badge>

				<CurrencySnapper
					locale={locale}
					tweak={currencyTweak}
					defaultCurrency={defaultCurrency}
					availableCurrencies={availableCurrencies}
					onChange={onChangeCurrency}
				/>
			</div>

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
