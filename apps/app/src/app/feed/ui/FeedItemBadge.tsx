import { Badge } from "@use-pico/client/ui/badge";
import { Tx } from "@use-pico/client/ui/tx";
import { tvc } from "@use-pico/cls";
import type { tFeed } from "@zbav-se.me/sdk/api/user";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { HeroImage } from "@zbav-se.me/ui/img";
import { type FC, type PropsWithChildren, type ReactNode, useState } from "react";
import { ListingCountBadge } from "~/app/listing/ui/ListingCountBadge";
import { FeedSetupButton } from "./button/FeedSetupButton";

export namespace FeedItemBadge {
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

export const FeedItemBadge: FC<FeedItemBadge.Props> = ({
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
		<Badge
			data-ui={"FeedItemBadge"}
			data-id={feed.id}
			className={tvc([
				"h-48",
				className,
			])}
			ui={{
				tone: "primary",
				round: "md",
				position: "relative",
				width: "full",
				size: undefined,
				...ui,
			}}
			{...props}
		>
			{linkTo.header({
				locale,
				feedId: feed.id,
				children: feed.upload ? (
					<HeroImage
						src={feed.upload.url}
						alt={`Hero image for feed ${feed.id}`}
						visible
						round={"default"}
						className="w-full"
					/>
				) : (
					<div className="w-full h-48" />
				),
			})}

			<Badge
				className={"h-fit"}
				ui={{
					round: "md",
					tone: "secondary",
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
						size: "md",
						snapTo: "bottom-left",
					}}
				/>
			) : null}

			<ListingCountBadge
				locale={locale}
				count={count}
				query={feed.query}
			/>
		</Badge>
	);
};
