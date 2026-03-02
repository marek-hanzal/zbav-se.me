import { useLocale } from "@use-pico/client/hook";
import { EditIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer/feed";
import { type FC, useState } from "react";
import { ListItem } from "~/app/@common/list-item/ListItem";
import { EditorSheet } from "~/app/v0/@buyer/feed/ui/EditorSheet";
import { ListingCount } from "./ListingCount";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		feedId: string;
	}
}

export const Data: FC<Data.Props> = ({ feedId, ui, ...props }) => {
	const locale = useLocale();
	const [isFeedSettings, setIsFeedSettings] = useState(false);
	const { data: feed } = withFeedQuery.useFetchQuery(feedId);

	return (
		<Container
			data-ui={"Item[Container]"}
			data-id={feed.id}
			ui={{
				position: "relative",
				width: "full",
				...ui,
			}}
			{...props}
		>
			<LinkTo
				data-ui={"FeedList-[LinkTo.header]"}
				to={"/$locale/buyer/feed/$id/list"}
				params={{
					locale,
					id: feedId,
				}}
				ui={{
					display: "block",
					height: "full",
				}}
			>
				<ListItem
					hero={feed.upload ?? undefined}
					title={
						<Tx
							label={feed.name}
							ui={{
								tone: "neutral",
								theme: "light",
								color: "lead",
								font: "semibold",
								display: "block",
								width: "full",
								text: "sm",
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
					bottom={
						<Typo
							label={<ListingCount query={feed.query} />}
							ui={{
								tone: "neutral",
								theme: "light",
								color: "lead",
								text: "xs",
							}}
						/>
					}
				/>
			</LinkTo>

			<Button
				data-ui={"Item-[FeedSetupButton]"}
				iconEnabled={EditIcon}
				iconProps={{
					ui: {
						text: "lg",
					},
				}}
				onClick={() => setIsFeedSettings((prev) => !prev)}
				ui={{
					tone: "secondary",
					theme: "light",
					background: "default",
					border: true,
					shadow: true,
					size: "sm",
					snapTo: "bottom-left",
					items: "center",
					justify: "center",
					color: "lead",
					round: "full",
					square: "sm",
					opacity: "8",
				}}
			/>

			<EditorSheet
				data-ui={"Item-[FeedEditorSheet]"}
				feedId={feed.id}
				state={{
					value: isFeedSettings,
					set: setIsFeedSettings,
				}}
			/>
		</Container>
	);
};
