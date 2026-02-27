import { ChevronRightIcon, Icon, SettingsIcon } from "@use-pico/client/icon";
import { Badge } from "@use-pico/client/ui/badge";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type PropsWithChildren, type ReactNode, useState } from "react";
import { EditorSheet } from "~/app/v0/@buyer-user/feed/ui/EditorSheet";
import { ListingCountBadge } from "~/app/v0/@buyer-user/listing/ui/ListingCountBadge";

export namespace Item {
	export type Tools = "setup";

	export namespace LinkTo {
		export interface Props extends PropsWithChildren {
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
		feed: tFeed;
		tools: Tools[];
		count?: number;
		linkTo: LinkTo;
	}

	export type PropsEx = Omit<Props, "feed">;
}

export const Item: FC<Item.Props> = ({
	feed,
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
				"h-48 md:h-92",
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
							icon={ChevronRightIcon}
							ui={{
								text: "3xl",
								color: "text",
								opacity: "6",
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
				className={"h-fit max-w-full min-w-0 overflow-hidden text-center"}
			>
				<Tx
					label={feed.name}
					ui={{
						tone: "brand",
						theme: "light",
						color: "lead",
						font: "bold",
						display: "block",
						width: "full",
						truncate: true,
					}}
					className={[
						"block",
						"w-full",
						"max-w-full",
						"min-w-0",
					]}
				/>
			</Badge>

			{tools.includes("setup") ? (
				<>
					<Button
						data-ui={"Item-[FeedSetupButton]"}
						iconEnabled={SettingsIcon}
						iconProps={{
							ui: {
								text: "2xl",
							},
						}}
						onClick={() => setIsFeedSettings((prev) => !prev)}
						ui={{
							theme: "light",
							background: "default",
							tone: "secondary",
							size: "sm",
							snapTo: "top-right",
							items: "center",
							justify: "center",
							color: "icon",
							round: "full",
							square: "default",
							opacity: "8",
						}}
					/>

					<EditorSheet
						data-ui={"Item-[FeedEditorSheet]"}
						feed={feed}
						state={{
							value: isFeedSettings,
							set: setIsFeedSettings,
						}}
					/>
				</>
			) : null}

			<ListingCountBadge
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
