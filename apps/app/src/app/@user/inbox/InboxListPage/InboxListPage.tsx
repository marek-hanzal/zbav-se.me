import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tInboxCountQuery, tInboxQuery } from "@zbav-se.me/sdk/api/user";
import { withInboxArchiveMutation } from "@zbav-se.me/sdk/mutation/user/inbox";
import { withInboxQuery } from "@zbav-se.me/sdk/query/user/inbox";
import { TitleContainer } from "@zbav-se.me/ui/container";
import type { FC } from "react";
import { Suspense, useMemo, useState } from "react";
import { HomeMenuButton } from "~/app/@user/home/~public/HomeMenuButton";
import { InboxList } from "./InboxList/InboxList";

export namespace InboxListPage {
	export interface Props extends TitleContainer.Props {
		//
	}

	export type PriorityFilter = "all" | "high";
}

const toInboxQuery = (
	priority: InboxListPage.PriorityFilter,
	archivedAtIsNull: boolean,
): tInboxQuery => ({
	where: {
		archivedAtIsNull,
	},
	filter:
		priority === "high"
			? {
					priority: "high",
				}
			: undefined,
	sort: [
		{
			field: "timestamp",
			order: "desc",
		},
	],
});

const toCountQuery = (
	priority: InboxListPage.PriorityFilter,
	archivedAtIsNull: boolean,
): tInboxCountQuery => ({
	where: {
		archivedAtIsNull,
	},
	filter:
		priority === "high"
			? {
					priority: "high",
				}
			: undefined,
});

export namespace Data {
	export interface Props {
		priority: InboxListPage.PriorityFilter;
	}
}

const Data: FC<Data.Props> = ({ priority }) => {
	const archiveMutation = withInboxArchiveMutation.useMutation();
	const invalidate = withInboxQuery.useInvalidator();

	const activeQuery = useMemo(
		() => toInboxQuery(priority, true),
		[
			priority,
		],
	);
	const archivedQuery = useMemo(
		() => toInboxQuery(priority, false),
		[
			priority,
		],
	);
	const activeCountQuery = useMemo(
		() => toCountQuery(priority, true),
		[
			priority,
		],
	);
	const archivedCountQuery = useMemo(
		() => toCountQuery(priority, false),
		[
			priority,
		],
	);

	const { data: activeCount } = withInboxQuery.useCountQuery(activeCountQuery);

	return (
		<Container
			data-ui="InboxListPageData[Container]"
			ui={{
				scroll: "vertical",
				height: "full",
				flow: "vertical",
				gap: "default",
				inner: "default",
			}}
		>
			<Container
				ui={{
					flow: "horizontal",
					gap: "xs",
				}}
			>
				<Button
					data-ui="InboxListPageData[MarkAll]"
					onClick={() => {
						archiveMutation.mutate(activeQuery, {
							onSuccess: async () => {
								await Promise.all([
									invalidate(
										[
											"collection",
										],
										{
											collection: activeQuery,
										},
									),
									invalidate(
										[
											"collection",
										],
										{
											collection: archivedQuery,
										},
									),
									invalidate(
										[
											"count",
										],
										{
											count: activeCountQuery,
										},
									),
									invalidate(
										[
											"count",
										],
										{
											count: archivedCountQuery,
										},
									),
								]);
							},
						});
					}}
					disabled={activeCount.filter === 0}
					ui={{
						size: "xs",
						border: true,
						round: "sm",
					}}
				>
					<Tx label="Mark all (button)" />
				</Button>
			</Container>

			<Container data-ui="InboxListPageData[Active]">
				<InboxList query={activeQuery} />
			</Container>

			<Container
				data-ui="InboxListPageData[Divider]"
				ui={{
					border: true,
					width: "full",
				}}
			/>

			<Container data-ui="InboxListPageData[Archived]">
				<InboxList
					query={archivedQuery}
					textEmpty="No archived inbox items (message)"
				/>
			</Container>
		</Container>
	);
};

export const InboxListPage: FC<InboxListPage.Props> = (props) => {
	const [priority, setPriority] = useState<InboxListPage.PriorityFilter>("all");

	return (
		<TitleContainer
			textTitle={translator.text("Inbox (title)")}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container
				data-ui="InboxListPage[Toolbar]"
				ui={{
					flow: "horizontal",
					gap: "xs",
					inner: "default",
				}}
			>
				<Button
					onClick={() => {
						setPriority("all");
					}}
					ui={{
						size: "xs",
						theme: priority === "all" ? "light" : "dark",
						tone: priority === "all" ? "primary" : "neutral",
					}}
				>
					<Tx label="All (label)" />
				</Button>
				<Button
					onClick={() => {
						setPriority("high");
					}}
					ui={{
						size: "xs",
						theme: priority === "high" ? "light" : "dark",
						tone: priority === "high" ? "primary" : "neutral",
					}}
				>
					<Tx label="High only (label)" />
				</Button>
			</Container>

			<Suspense
				fallback={
					<SpinnerContainer
						type="icon"
						ui={{
							height: "full",
						}}
					/>
				}
			>
				<Data priority={priority} />
			</Suspense>
		</TitleContainer>
	);
};
