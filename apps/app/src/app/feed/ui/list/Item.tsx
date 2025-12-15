import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type PropsWithChildren, type ReactNode, useState } from "react";
import { SetupSheet } from "~/app/feed/ui/SetupSheet";
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
								snapTo: "right-center",
							}}
						/>
					</Container>
				),
			})}

			<Badge
				ui={{
					tone: "neutral",
					theme: "light",
					inner: "default",
					snapTo: "bottom",
					round: "md",
				}}
				className={"h-fit text-center"}
			>
				<Tx
					label={feed.name}
					ui={{
						tone: "brand",
						theme: "light",
						color: "lead",
						font: "bold",
						truncate: true,
					}}
				/>
			</Badge>

			{tools.includes("setup") ? (
				<>
					<SetupButton
						data-ui={"Item-[FeedSetupButton]"}
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

					<SetupSheet
						data-ui={"Item-[FeedSetupSheet]"}
						locale={locale}
						feed={feed}
						state={{
							value: isFeedSettings,
							set: setIsFeedSettings,
						}}
					/>
				</>
			) : null}

			<ListingCountBadge
				locale={locale}
				query={feed.query}
				count={count}
				ui={{
					tone: "neutral",
					snapTo: "top-left",
					inner: "default",
					size: undefined,
				}}
				className={"max-w-1/3"}
			/>
		</Container>
	);
};
