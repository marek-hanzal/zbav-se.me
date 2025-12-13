import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type PropsWithChildren, type ReactNode, useState } from "react";
import { ListingCountBadge } from "~/app/listing/ui/ListingCountBadge";
import { SetupButton } from "../button/SetupButton";

export namespace Item {
	export type Tools = "setup";

	export namespace LinkTo {
		export interface Props extends PropsWithChildren {
			locale: string;
			feedId: string;
		}

		export type RenderFn = (props: Props) => ReactNode;
	}

	/**
	 * Links required by this component
	 */
	export interface LinkTo {
		/**
		 * Header link
		 */
		header: LinkTo.RenderFn;
	}

	export interface Props extends Omit<Badge.Props, "children"> {
		locale: string;
		feed: tFeed;
		defaultOpen: boolean;
		tools: Tools[];
		count?: number;
		linkTo: LinkTo;
	}
}

export const Item: FC<Item.Props> = ({
	locale,
	feed,
	defaultOpen,
	tools,
	count,
	linkTo,
	ui,
	className,
	...props
}) => {
	const [isFeedSettings, setIsFeedSettings] = useState(false);
	const hasListings = count && count > 0;

	return (
		<Container
			data-ui={"Item[Container]"}
			data-id={feed.id}
			className={tvc([
				"h-48",
				className,
			])}
			ui={{
				tone: "secondary",
				position: "relative",
				round: "lg",
				width: "full",
				size: undefined,
				shadow: true,
				...ui,
			}}
			{...props}
		>
			{linkTo.header({
				locale,
				feedId: feed.id,
				children: feed.upload ? (
					<HeroImage
						data-ui={"Item-[HeroImage]"}
						src={feed.upload.url}
						alt={`Hero image for feed ${feed.id}`}
						visible
						ui={{
							round: "lg",
							width: "full",
						}}
					/>
				) : (
					<Container
						ui={{
							tone: "subtle",
							theme: "light",
							width: "full",
							height: "full",
							round: "lg",
							flow: "horizontal",
							items: "center",
							justify: "center",
							background: "default",
							position: "relative",
						}}
					>
						<Icon
							icon={ArrowRightIcon}
							ui={{
								text: "3xl",
								color: "text",
								opacity: "medium",
								snapTo: "bottom-right",
							}}
						/>
					</Container>
				),
			})}

			<Badge
				className={"h-fit"}
				ui={{
					tone: "neutral",
					width: "content",
					inner: "default",
					snapTo: "top-center",
					round: "md",
					opacity: "low",
				}}
			>
				<Tx
					label={feed.name}
					ui={{
						font: "bold",
						truncate: true,
					}}
				/>
			</Badge>

			{tools.includes("setup") && hasListings ? (
				<SetupButton
					data-ui={"Item-[FeedSetupButton]"}
					locale={locale}
					iconProps={{
						ui: {
							text: "2xl",
						},
					}}
					state={{
						value: isFeedSettings,
						set: setIsFeedSettings,
					}}
					feed={feed}
					defaultOpen={defaultOpen}
					noDelete={false}
					label={null}
					ui={{
						tone: "secondary",
						size: "sm",
						snapTo: "top-right",
						items: "center",
						justify: "center",
						color: "icon",
						round: "full",
						square: "default",
						opacity: "low",
					}}
				/>
			) : null}

			{hasListings ? (
				<ListingCountBadge
					locale={locale}
					count={count}
					query={feed.query}
					ui={{
						snapTo: "top-left",
						background: undefined,
						border: false,
						shadow: false,
					}}
				/>
			) : null}

			{hasListings ? null : (
				<SetupButton
					data-ui={"Item-[FeedSetupButton]"}
					locale={locale}
					iconProps={{
						ui: {
							text: "xl",
						},
					}}
					state={{
						value: isFeedSettings,
						set: setIsFeedSettings,
					}}
					feed={feed}
					defaultOpen={defaultOpen}
					noDelete={false}
					label={"No listings (badge)"}
					ui={{
						tone: "secondary",
						theme: "light",
						snapTo: "bottom",
						color: "lead",
						opacity: "low",
						inner: "default",
						items: "center",
						justify: "center",
						gap: "default",
						font: "bold",
						shadow: true,
					}}
				/>
			)}
		</Container>
	);
};
