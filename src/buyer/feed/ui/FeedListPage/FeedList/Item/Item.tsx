import { Suspense, useState } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { withFallback } from "@/lib/client/fallback";
import { Group } from "@/lib/client/group";
import { EditIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { Typo } from "@/lib/client/typo";
import { translator } from "@/lib/common/translator";
import { withFeedQuery } from "~/buyer/feed/query/withFeedQuery";
import { ListingCount } from "~/buyer/listing/ui/ListingCount";
import { ListItem } from "~/common/list-item/ListItem";
import { FeedEditorSheet } from "../../../FeedEditor/FeedEditorSheet";
import { DeleteButton } from "../DeleteButton";

export namespace Item {
	export interface Props extends Container.Props, MarkSuspense.Props {
		feedId: string;
	}
}

export const Item = withFallback(
	({ feedId, ...props }: Item.Props) => {
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
						"data-ui-text": "lg",
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
