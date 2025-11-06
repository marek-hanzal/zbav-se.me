import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, CloseIcon, SpinnerIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { type tFeedCreate, zFeed } from "@zbav-se.me/sdk/api/session";
import { withFeedCreateMutation } from "@zbav-se.me/sdk/mutation";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";
import { FeedContainer } from "~/app/feed/ui/FeedContainer";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/submit")({
	validateSearch: FeedWizardSchema,
	ssr: false,
	pendingComponent() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();

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
						tone={"secondary"}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/buyer/feed/select",
									params: {
										locale,
									},
								});
							},
						}}
					/>
				}
			>
				<Status icon={SpinnerIcon} />
			</TitleContainer>
		);
	},
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

		const isLoading = feedCreateMutation.isPending;

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
						tone={"secondary"}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						tone={"secondary"}
						confirmProps={{
							tone: "danger",
							onClick: () => {
								navigate({
									to: "/$locale/buyer/feed/select",
									params: {
										locale,
									},
								});
							},
						}}
					/>
				}
				bottom={
					<Button
						iconEnabled={SendPackageIcon}
						label={"Submit - feed (button)"}
						disabled={isLoading}
						loading={isLoading}
						tone={"primary"}
						theme={"dark"}
						size={"lg"}
						full
						onClick={() => {
							feedCreateMutation.mutate(state as tFeedCreate);
						}}
					/>
				}
			>
				<FeedContainer feed={zFeed.parse(state)} />
			</TitleContainer>
		);
	},
});
