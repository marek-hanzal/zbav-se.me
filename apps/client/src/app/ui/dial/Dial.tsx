import { Badge, Icon, Tx, Typo, useDoubleTap } from "@use-pico/client";
import { tvc, useCls } from "@use-pico/cls";
import { toHumanNumber } from "@use-pico/common";
import { type FC, type RefObject, useRef, useState } from "react";
import { DialCls } from "~/app/ui/dial/DialCls";
import { Item } from "~/app/ui/dial/Item";
import { anim, useAnim } from "~/app/ui/gsap";
import { BackspaceIcon } from "~/app/ui/icon/BackspaceIcon";
import { CheckIcon } from "~/app/ui/icon/CheckIcon";

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
	export interface Props extends DialCls.Props {
		ref?: RefObject<HTMLDivElement | null>;
		locale: string;
		value: number | undefined;
		onChange: (value: number | undefined) => void;
	}
}

export const Dial: FC<Dial.Props> = ({
	ref,
	locale,
	value,
	onChange,
	cls = DialCls,
	tweak,
}) => {
	const { slots } = useCls(cls, tweak);
	const [price, setPrice] = useState(value?.toString() ?? "");
	const displayRef = useRef<HTMLDivElement>(null);
	const number = parseFloat(price);

	const { contextSafe } = useAnim({
		scope: ref,
	});

	const onConfirm = contextSafe((number: number | undefined) => {
		onChange(number);
		anim.timeline()
			.to(displayRef.current, {
				scale: 0.8,
				onComplete() {
					setPrice("");
				},
			})
			.to(displayRef.current, {
				scale: 1,
			});
	});

	const onClear = contextSafe(() => {
		anim.timeline({
			defaults: {
				duration: 0.15,
			},
		})
			.to(displayRef.current, {
				opacity: 0,
				scale: 0.8,
				onComplete() {
					setPrice("");
					onChange(undefined);
				},
			})
			.to(displayRef.current, {
				opacity: 1,
				scale: 1,
			});
	});

	const { onTouchStart } = useDoubleTap({
		onDoubleTap() {
			onClear();
		},
		delay: 250,
	});

	return (
		<div
			ref={ref}
			className={slots.root()}
		>
			<Badge
				ref={displayRef}
				tone={"secondary"}
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
						},
					},
				}}
			>
				{price ? (
					<div className={"flex flex-col items-start"}>
						<Typo
							label={price}
							size={"xl"}
							font={"bold"}
							display={"block"}
						/>
						<Typo
							label={toHumanNumber({
								number: parseFloat(price),
							})}
							size={"sm"}
							display={"block"}
							tweak={{
								slot: {
									root: {
										class: [
											"opacity-50",
										],
									},
								},
							}}
						/>
					</div>
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
					disabled={!price}
					onClick={() => {
						setPrice((prev) => prev.slice(0, -1));
					}}
					onTouchStart={onTouchStart}
				/>
			</Badge>

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
					<Item
						key={`price-${index + 1}`}
						icon={icons[(index + 1) as keyof typeof icons]}
						onClick={() =>
							setPrice((prev) => digit(prev, index + 1))
						}
						disabled={false}
						slots={slots}
					/>
				))}

				<Item
					icon={"icon-[fluent--comma-20-filled]"}
					disabled={!price || price.includes(".")}
					onClick={() => setPrice((prev) => digit(prev, "."))}
					slots={slots}
				/>

				<Item
					icon={icons[0]}
					disabled={false}
					onClick={() => setPrice((prev) => digit(prev, 0))}
					slots={slots}
				/>

				<Item
					icon={CheckIcon}
					disabled={!price}
					onClick={() => onConfirm(number)}
					slots={slots}
				/>
			</div>
		</div>
	);
};
