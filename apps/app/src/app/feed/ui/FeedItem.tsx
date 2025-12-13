import { ArrowRightIcon, Icon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type PropsWithChildren, type ReactNode, useState } from "react";
import { ListingCountBadge } from "~/app/listing/ui/ListingCountBadge";
import { FeedSetupButton } from "./button/FeedSetupButton";

export namespace FeedItem {
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

export const FeedItem: FC<FeedItem.Props> = ({
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
			data-ui={"FeedItem[Container]"}
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
						data-ui={"FeedItem-[HeroImage]"}
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
							tone: "secondary",
							theme: "light",
							width: "full",
							height: "full",
							round: "lg",
							flow: "horizontal",
							items: "center",
							justify: "center",
							background: "default",
						}}
					>
						<Icon
							icon={ArrowRightIcon}
							ui={{
								text: "3xl",
								color: "text",
								opacity: "high",
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

			{tools.includes("setup") ? (
				<FeedSetupButton
					data-ui={"FeedItem-[FeedSetupButton]"}
					locale={locale}
					state={{
						value: isFeedSettings,
						set: setIsFeedSettings,
					}}
					iconEnabled={FeedIcon}
					feed={feed}
					defaultOpen={defaultOpen}
					noDelete={false}
					ui={{
						tone: "secondary",
						size: "sm",
						snapTo: "bottom-left",
						color: "icon",
					}}
				/>
			) : null}

			<ListingCountBadge
				locale={locale}
				count={count}
				query={feed.query}
				ui={{
					size: "sm",
					snapTo: "bottom-right",
				}}
			/>
		</Container>
	);
};
