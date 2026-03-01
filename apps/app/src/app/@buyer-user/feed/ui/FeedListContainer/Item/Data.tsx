import { useLocale } from "@use-pico/client/hook";
import { SettingsIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { withFeedQuery } from "@zbav-se.me/sdk/query/buyer-user/feed";
import { type FC, useState } from "react";
import { ListingCount } from "~/app/@buyer-user/listing/ui/ListingCount";
import { ListItem } from "~/app/@common/list-item/ListItem";
import { EditorSheet } from "~/app/v0/@buyer-user/feed/ui/EditorSheet";

export namespace Data {
	export interface Props extends Container.Props, MarkSuspense.Props {
		feedId: string;
	}
}

export const Data: FC<Data.Props> = ({ feedId, ui, ...props }) => {
	const locale = useLocale();
	const [isFeedSettings, setIsFeedSettings] = useState(false);
	const feedQuery = withFeedQuery.useFetchQuery(feedId);
	const feed = feedQuery.data;

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
				data-ui={"FeedSelect-[LinkTo.header]"}
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
					bottom={
						<Typo
							label={<ListingCount query={feed.query} />}
							className={"max-w-1/3"}
						/>
					}
					ui={{
						tone: "secondary",
					}}
				/>
			</LinkTo>

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
					snapTo: "bottom-right",
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
		</Container>
	);
};
