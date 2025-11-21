import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { FeedDetailContainer } from "@zbav-se.me/buyer/feed";
import { type tFeedCreate, zFeed } from "@zbav-se.me/sdk/api/user";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation/user";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Fade } from "@zbav-se.me/ui/fade";
import { FeedIcon } from "@zbav-se.me/ui/icon";
import { useRef } from "react";
import { FeedWizardSchema } from "~/app/@buyer/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/submit")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();

		const feedCreateMutation = withFeedCreateMutation.useMutation({
			async onPostMutation({ result }) {
				return navigate({
					to: "/$locale/buyer/feed/select",
					params: {
						locale,
					},
					search: {
						feedId: result.id,
					},
				});
			},
		});

		const containerRef = useRef<HTMLDivElement>(null);

		return (
			<TitleContainer
				textTitle={"Feed submit (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/name"}
						search={state}
						params={{
							locale,
						}}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						iconProps={{
							size: "md",
						}}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/buyer/feed/select",
								});
							},
						}}
					/>
				}
				bottom={
					<Button
						iconEnabled={FeedIcon}
						label={"Submit - feed (button)"}
						disabled={feedCreateMutation.isPending}
						loading={feedCreateMutation.isPending}
						tone={"primary"}
						theme={"dark"}
						size={"lg"}
						full
						onClick={() => {
							feedCreateMutation.mutate({
								...state,
								query: {
									...state.query,
									where: {
										withOwn: false,
									},
								},
							} as tFeedCreate);
						}}
					/>
				}
			>
				<Fade scrollableRef={containerRef} />

				<FeedDetailContainer
					ref={containerRef}
					locale={locale}
					feed={zFeed
						.omit({
							id: true,
						})
						.parse(state)}
				/>
			</TitleContainer>
		);
	},
});
