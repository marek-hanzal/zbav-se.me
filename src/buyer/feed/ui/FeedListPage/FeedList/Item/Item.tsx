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
import { translator } from "@/lib/common/translation";
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
				data-ui={"Item"}
				data-id={feed.id}
				data-ui-position="relative"
				data-ui-width="full"
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
					data-ui-display="block"
					data-ui-height="full"
				>
					<ListItem
						hero={feed.upload?.url}
						title={
							<Tx
								label={feed.name}
								data-ui-tone="neutral"
								data-ui-theme="light"
								data-ui-color="lead"
								data-ui-font="semibold"
								data-ui-display="block"
								data-ui-width="full"
								data-ui-text="sm"
								data-ui-truncate
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
								data-ui-tone="neutral"
								data-ui-theme="light"
								data-ui-color="lead"
								data-ui-text="xs"
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
					data-ui-tone="secondary"
					data-ui-theme="light"
					data-ui-background="default"
					data-ui-border
					data-ui-shadow
					data-ui-size="sm"
					data-ui-snap-to="bottom-left"
					data-ui-items="center"
					data-ui-justify="center"
					data-ui-color="lead"
					data-ui-round="full"
					data-ui-square="sm"
					data-ui-opacity="8"
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
