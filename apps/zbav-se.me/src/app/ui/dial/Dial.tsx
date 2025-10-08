import { Icon, type IconCls, Tx, Typo, UnCheckIcon } from "@use-pico/client";
import { type Cls, tvc, useCls } from "@use-pico/cls";
import { type FC, useRef, useState } from "react";
import { DialCls } from "~/app/ui/dial/DialCls";
import { anim, useAnim } from "~/app/ui/gsap";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";
import { PriceIcon } from "~/app/ui/icon/PriceIcon";

const digit = (current: string, digit: number | string, limit = 8): string => {
	current = current === "NaN" ? "" : current;
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
	export interface Props extends DialCls.Props {
		value: number;
		onChange: (value: number) => void;
	}
}

export const Dial: FC<Dial.Props> = ({
	value,
	onChange,
	cls = DialCls,
	tweak,
}) => {
	const { slots } = useCls(cls, tweak);
	const [price, setPrice] = useState(value.toString());
	const rootRef = useRef<HTMLDivElement>(null);
	const displayRef = useRef<HTMLDivElement>(null);
	const number = parseFloat(price);

	const iconVariant: Cls.VariantsOf<IconCls> = {
		tone: "secondary",
		theme: "dark",
	};

	const { contextSafe } = useAnim({
		scope: rootRef,
	});

	const onConfirm = contextSafe((number: number) => {
		onChange(number);
		anim.timeline()
			.to(displayRef.current, {
				scale: 0.8,
			})
			.to(displayRef.current, {
				scale: 1,
			});
	});

	const onClear = contextSafe(() => {
		anim.timeline({
			defaults: {
				duration: 0.2,
			},
		})
			.to(displayRef.current, {
				opacity: 0,
				scale: 0.8,
				onComplete() {
					setPrice("");
					onChange(0);
				},
			})
			.to(displayRef.current, {
				opacity: 1,
				scale: 1,
			});
	});

	return (
		<div
			ref={rootRef}
			className={slots.root()}
		>
			<div
				ref={displayRef}
				className={slots.display()}
			>
				<Icon
					icon={PriceIcon}
					tone="primary"
					theme="dark"
				/>

				{Number.isNaN(number) ? (
					<Tx
						label={"Price (placeholder)"}
						size={"xl"}
						font={"bold"}
					/>
				) : (
					<Typo
						label={price}
						size={"xl"}
						font={"bold"}
					/>
				)}

				<Icon
					icon={UnCheckIcon}
					tone="primary"
					theme="dark"
					disabled={Number.isNaN(number)}
					onClick={onClear}
				/>
			</div>

			<div
				className={tvc([
					"grid",
					"grid-cols-3",
					"gap-4",
					"place-items-center",
				])}
			>
				{Array.from({
					length: 9,
				}).map((_, index) => (
					<div
						key={`price-${index + 1}`}
						className={slots.number()}
						onClick={() =>
							setPrice((prev) => digit(prev, index + 1))
						}
					>
						<Icon
							icon={icons[(index + 1) as keyof typeof icons]}
							{...iconVariant}
						/>
					</div>
				))}

				<div
					className={slots.number({
						variant: {
							disabled:
								Number.isNaN(number) || price.includes("."),
						},
					})}
					onClick={() => setPrice((prev) => digit(prev, "."))}
				>
					<Icon
						icon={"icon-[fluent--comma-20-filled]"}
						{...iconVariant}
					/>
				</div>

				<div
					className={slots.number()}
					onClick={() => setPrice((prev) => digit(prev, 0))}
				>
					<Icon
						icon={icons[0]}
						{...iconVariant}
					/>
				</div>

				<div
					className={slots.number({
						variant: {
							disabled: Number.isNaN(number),
						},
					})}
					onClick={() => {
						onConfirm(number);
					}}
				>
					<Icon
						icon={CheckIcon}
						{...iconVariant}
					/>
				</div>
			</div>
		</div>
	);
};
