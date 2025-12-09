import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import { Tx } from "@use-pico/client/ui/tx";
import { translator } from "@use-pico/common/translator";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useState } from "react";
import { toast } from "sonner";
import type { FeedItemBadge } from "~/app/feed/ui/FeedItemBadge";
import { FeedCreateButton } from "./FeedCreateButton";
import { FeedList } from "./FeedListContainer/FeedList";
import { FeedNameContainer } from "./FeedNameContainer";

export namespace FeedListContainer {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		limit?: number;
		scrollToId: string | undefined;
		tools: FeedItemBadge.Tools[];
		linkTo: FeedItemBadge.LinkTo;
	}
}

export const FeedListContainer: FC<FeedListContainer.Props> = ({
	locale,
	query,
	limit = 10,
	scrollToId,
	tools,
	linkTo,
	...props
}) => {
	// TODO One nice day - move to standalone component
	const [name, setName] = useState(translator.text("Feed name (default)"));
	const [change, setChange] = useState(true);
	/**
	 * We're keeping locale state just for "after creation" open state
	 */
	const [defaultOpenId, setDefaultOpenId] = useState<string | undefined>(undefined);
	const feedCreateMutation = withFeedCreateMutation.useMutation({
		onSuccess(data) {
			setDefaultOpenId(data.id);
		},
		onSettled() {
			setChange(false);
			setName("");
		},
	});

	return (
		<withFeedCountQuery.Suspense
			data={{}}
			fallback={<SpinnerContainer />}
		>
			{({ data }) => {
				const isLimitReached = data.filter >= limit;

				if (data.filter === 0) {
					return (
						<Container
							data-ui={"FeedListContainer-first-feed"}
							ui={{
								layout: "vertical-content-footer",
								gap: "default",
							}}
						>
							<FeedNameContainer
								value={name}
								ui={{
									height: "full",
								}}
								onChange={(value) => {
									setChange(true);
									setName(value);
								}}
								onSubmit={(name) => {
									toast.promise(
										feedCreateMutation.mutateAsync({
											name,
											query: {
												where: {
													withOwn: false,
												},
											},
										}),
										{
											loading: translator.text("Loading... (toast)"),
											success: translator.text("First feed created (toast)"),
											error: translator.text(
												"Error creating first feed (toast)",
											),
										},
									);
								}}
								statusProps={{
									textTitle: translator.text("First feed (title)"),
								}}
							>
								<Tx
									data-ui="FeedListContainer-first-feed-hint"
									label={"First feed (hint)"}
									size={"sm"}
									tone={"subtle"}
								/>
							</FeedNameContainer>

							<Button
								label={"Feed - save (button)"}
								loading={feedCreateMutation.isPending}
								disabled={!change || !name || feedCreateMutation.isPending}
								onClick={() => {
									toast.promise(
										feedCreateMutation.mutateAsync({
											name,
											query: {
												where: {
													withOwn: false,
												},
											},
										}),
										{
											loading: translator.text("Loading... (toast)"),
											success: translator.text("First feed created (toast)"),
											error: translator.text(
												"Error creating first feed (toast)",
											),
										},
									);
								}}
							/>
						</Container>
					);
				}

				return (
					<Container
						data-ui={"FeedListContainer-root"}
						ui={{
							layout: isLimitReached ? "vertical" : "vertical-content-footer",
							gap: "md",
						}}
						{...props}
					>
						<FeedList
							_suspense={"I know"}
							locale={locale}
							query={query}
							defaultOpenId={defaultOpenId}
							scrollToId={scrollToId}
							tools={tools}
							linkTo={linkTo}
						/>

						{data.filter > 0 ? (
							<FeedCreateButton
								disabled={isLimitReached}
								onCreate={(data) => {
									setDefaultOpenId(data.id);
								}}
							/>
						) : null}
					</Container>
				);
			}}
		</withFeedCountQuery.Suspense>
	);
};
