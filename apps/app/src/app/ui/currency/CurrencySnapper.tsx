import { Badge, Container, useSnapperNav } from "@use-pico/client";
import { withCurrencyList } from "@use-pico/common";
import { type FC, memo, useEffect, useId, useMemo, useRef } from "react";

export namespace CurrencySnapper {
	export interface Props extends Container.Props {
		locale: string;
		defaultCurrency?: string;
		availableCurrencies?: readonly string[];
		onChange(currency: string): void;
	}
}

export const CurrencySnapper: FC<CurrencySnapper.Props> = memo(
	({
		locale,
		defaultCurrency,
		availableCurrencies,
		onChange,
		tweak,
		...props
	}) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const currencyId = useId();
		const currencyList = useMemo(() => {
			return withCurrencyList({
				locale,
				available: availableCurrencies as string[],
			});
		}, [
			locale,
			availableCurrencies,
		]);

		const snapperNav = useSnapperNav({
			containerRef,
			count: currencyList.length,
			orientation: "vertical",
			onSnap(index) {
				const currency = currencyList[index]?.code;
				if (currency) {
					onChange(currency);
				}
			},
		});

		// biome-ignore lint/correctness/useExhaustiveDependencies: One-time-shot
		useEffect(() => {
			if (!defaultCurrency) {
				return;
			}
			snapperNav.api.snapTo(`.currency-${defaultCurrency}`, "instant");
		}, []);

		return (
			<Container
				ref={containerRef}
				layout={"vertical-full"}
				snap={"vertical-center"}
				overflow={"vertical"}
				gap={"lg"}
				tweak={[
					tweak,
					{
						slot: {
							root: {
								class: [
									"h-12",
									"touch-pan-y",
									"[&_*]:touch-pan-y",
									"overscroll-contain",
								],
							},
						},
					},
				]}
				{...props}
			>
				{currencyList.map((info) => {
					return (
						<Badge
							key={`${currencyId}-${info.code}`}
							tone={"primary"}
							size={"lg"}
							tweak={{
								slot: {
									root: {
										class: [
											`currency-${info.code}`,
											"w-full",
										],
									},
								},
							}}
						>
							{info.symbol}
						</Badge>
					);
				})}
			</Container>
		);
	},
);
