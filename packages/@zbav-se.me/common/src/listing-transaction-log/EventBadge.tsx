import { Badge, type BadgeCls } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Typo } from "@use-pico/client/ui/typo";
import { type Cls, VariantProvider } from "@use-pico/cls";
import { toTimeDiff } from "@use-pico/common/time";
import type { tListingTransactionSideEnum, tUserSideEnum } from "@zbav-se.me/sdk/api/user";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import type { FC, ReactNode } from "react";
import type { useSideSwitch } from "../listing-transaction/useSideSwitch";

export namespace EventBadge {
	export interface Props extends Badge.Props {
		locale: string;
		side: tUserSideEnum;
		actor: tListingTransactionSideEnum;
		type: useSideSwitch.Type;
		toolbar: ReactNode;
		timestamp: string;
		isCurrent: boolean;
		isClosed: boolean;
	}
}

/**
 * This is a base component for all transaction log items (events).
 *
 * Render functions have intentionally | undefined so implementation _explicitly_ disables certain (eventually
 * invalid) combinations.
 *
 * This component by default expects "Badge" component being rendered, but it does not matter.
 */
export const EventBadge: FC<EventBadge.Props> = ({
	locale,
	side,
	actor,
	type,
	toolbar,
	timestamp,
	isCurrent,
	isClosed,
	tweak,
	onClick,
	children,
	...props
}) => {
	const isCurrentClosed = isClosed && isCurrent;

	const typeTweaks: Partial<Record<useSideSwitch.Type, Cls.TweaksOf<BadgeCls>>> = {
		buyer: {
			slot: {
				root: {
					class: isCurrentClosed
						? [
								"items-center",
								"justify-center",
							]
						: [
								"ml-auto",
							],
				},
			},
		},
		"buyer-to-seller": {
			slot: {
				root: {
					class: isCurrentClosed
						? [
								"items-center",
								"justify-center",
							]
						: undefined,
				},
			},
		},
		seller: {
			slot: {
				root: {
					class: isCurrentClosed
						? [
								"items-center",
								"justify-center",
							]
						: [
								"ml-auto",
							],
				},
			},
		},
		"seller-to-buyer": {
			slot: {
				root: {
					class: isCurrentClosed
						? [
								"items-center",
								"justify-center",
							]
						: undefined,
				},
			},
		},
	};

	const typeProps: Partial<Record<useSideSwitch.Type, Badge.Props>> = {
		buyer: {
			tone: isCurrentClosed ? "neutral" : "primary",
		},
		seller: {
			tone: isCurrentClosed ? "neutral" : "primary",
		},
		"seller-to-buyer": {
			tone: isCurrentClosed ? "neutral" : "secondary",
		},
		"buyer-to-seller": {
			tone: isCurrentClosed ? "neutral" : "secondary",
		},
	};

	const badgeTweak: Cls.TweaksOf<BadgeCls> = {
		slot: {
			root: {
				class: [
					"h-fit",
					"flex",
					"flex-col",
					"items-start",
					"justify-between",
					"gap-1",
					"px-2",
					"py-1",
					"w-6/8",
					"max-w-6/8",
					"transition-all",
					isCurrentClosed
						? [
								"mx-auto",
								"w-full",
								"max-w-full",
								"my-2",
							]
						: undefined,
				],
				token: isCurrent
					? [
							"shadow.lg",
						]
					: undefined,
			},
		},
	};

	const defaultProps: Badge.Props = {
		round: "default",
		...props,
	};

	return (
		<Badge
			ui={`EventBadge-${type}`}
			{...defaultProps}
			{...typeProps[type]}
			tweak={[
				tweak,
				badgeTweak,
				typeTweaks[type],
			]}
			onClick={isClosed || !isCurrent ? undefined : onClick}
		>
			{children}

			<Typo
				label={toTimeDiff({
					locale,
					time: timestamp,
				})}
				font={"normal"}
				size={"sm"}
			/>

			{isCurrent && !isClosed ? (
				<VariantProvider
					cls={ThemeCls}
					variant={{
						tone: "unset",
						theme: "unset",
					}}
				>
					<Container
						layout={"horizontal-flex"}
						gap={"sm"}
					>
						{toolbar}
					</Container>
				</VariantProvider>
			) : null}
		</Badge>
	);
};
