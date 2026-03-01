import { SettingsIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import type { tFeed } from "@zbav-se.me/sdk/api/buyer-user";
import { type FC, type PropsWithChildren, type ReactNode, useState } from "react";
import { ListItem } from "~/app/@common/list-item/ListItem";
import { EditorSheet } from "~/app/v0/@buyer-user/feed/ui/EditorSheet";
import { ListingCountBadge } from "~/app/v0/@buyer-user/listing/ui/ListingCountBadge";

export namespace View {
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

	export interface Props extends Omit<ListItem.Props, "hero" | "title" | "bottom"> {
		feed: tFeed;
		tools: Tools[];
		count?: number;
		linkTo: LinkTo;
	}

	export type PropsEx = Omit<Props, "feed">;
}

export const View: FC<View.Props> = ({ feed, tools, count, linkTo, ui, className, ...props }) => {
	const [isFeedSettings, setIsFeedSettings] = useState(false);

	return (
		<Container
			data-ui={"Item[Container]"}
			data-id={feed.id}
			ui={{
				position: "relative",
				width: "full",
			}}
		>
			{linkTo.header({
				feedId: feed.id,
				children: (
					<ListItem
						hero={feed.upload ?? undefined}
						title={
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
						}
						bottom={undefined}
						ui={{
							tone: "secondary",
							...ui,
						}}
						className={className}
						{...props}
					/>
				),
			})}

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
