import { Button } from "@use-pico/client/ui/button";
import { Container, SpinnerContainer } from "@use-pico/client/ui/container";
import type { tFeedQuery } from "@zbav-se.me/sdk/api/user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { withFeedCountQuery } from "@zbav-se.me/sdk/query/user";
import { type FC, useState } from "react";
import { FeedCreateButton } from "./FeedCreateButton";
import { FeedList } from "./FeedListContainer/FeedList";
import { FeedNameContainer } from "./FeedNameContainer";

export namespace FeedListContainer {
	export interface Props extends Container.Props {
		locale: string;
		query: tFeedQuery;
		limit?: number;
	}
}

export const FeedListContainer: FC<FeedListContainer.Props> = ({
	locale,
	query,
	limit = 10,
	...props
}) => {
	const [name, setName] = useState("");
	const [change, setChange] = useState(false);
	const feedCreateMutation = withFeedCreateMutation.useMutation({
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

				return (
					<Container
						layout={isLimitReached ? "vertical" : "vertical-content-footer"}
						items={"start"}
						justify={"between"}
						gap={"md"}
						{...props}
					>
						{data.filter === 0 ? (
							<Container
								layout={"vertical-content-footer"}
								gap={"md"}
								height={"fit"}
								tone={"unset"}
								theme={"unset"}
								square={"md"}
							>
								<FeedNameContainer
									height={"fit"}
									value={name}
									onChange={(value) => {
										setChange(true);
										setName(value);
									}}
								/>

								<Button
									tone={"secondary"}
									theme={"dark"}
									label={"Feed - save (button)"}
									size={"xl"}
									loading={feedCreateMutation.isPending}
									disabled={!change || !name || feedCreateMutation.isPending}
									full
									onClick={() => {
										feedCreateMutation.mutate({
											name,
											query: {
												where: {
													withOwn: false,
												},
											},
										});
									}}
								/>
							</Container>
						) : null}

						<FeedList
							_suspense={"I know"}
							locale={locale}
							query={query}
						/>

						{data.filter > 0 ? <FeedCreateButton disabled={isLimitReached} /> : null}
					</Container>
				);
			}}
		</withFeedCountQuery.Suspense>
	);
};
