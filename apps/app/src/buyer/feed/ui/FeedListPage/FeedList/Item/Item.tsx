import { useLocale } from "@use-pico/client/hook";
import { EditIcon } from "@use-pico/client/icon";
import type { MarkSuspense } from "@use-pico/client/type";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { Group } from "@use-pico/client/ui/group";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { withFallback } from "@use-pico/client/utils";
import { translator } from "@use-pico/common/translator";
import { Suspense, useState } from "react";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { ListItem } from "~/common/list-item/ListItem";
import { ListingCount } from "~/common/listing/ui/ListingCount";
import { FeedEditorSheet } from "../../../FeedEditor/FeedEditorSheet";
import { DeleteButton } from "../DeleteButton";

export namespace Item {
	export interface Props extends Container.Props, MarkSuspense.Props {
		feedId: string;
	}
}

export const Item = withFallback(
	({ feedId, ui, ...props }: Item.Props) => {
		const locale = useLocale();
		const [isEditor, setIsEditor] = useState(false);
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
					data-action={"open feed listings"}
					data-ui={"FeedList-[LinkTo.header]"}
					to={"/$locale/app/buyer/feed/$id/list"}
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
						hero={feed.upload}
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
								label={
									<Suspense fallback={<ListingCount.Fallback />}>
										<ListingCount
											_suspense={"I know"}
											query={feed.query}
										/>
									</Suspense>
								}
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
					data-action={isEditor ? "close feed editor" : "open feed editor"}
					iconEnabled={EditIcon}
					iconProps={{
						ui: {
							text: "lg",
						},
					}}
					onClick={() => setIsEditor((prev) => !prev)}
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

				<FeedEditorSheet
					data-ui={"Item-[FeedEditorSheet]"}
					feedId={feed.id}
					state={{
						value: isEditor,
						set: setIsEditor,
					}}
				>
					<Group>
						<DeleteButton
							feedId={feedId}
							onDelete={async () => {
								setIsEditor(false);
							}}
						/>
					</Group>
				</FeedEditorSheet>
			</Container>
		);
	},
	(props: ListItem.PropsEx) => {
		return (
			<ListItem
				hero={undefined}
				title={translator.text("Loading... (label)")}
				bottom={undefined}
				{...props}
			/>
		);
	},
);
