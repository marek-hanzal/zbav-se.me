import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, CloseIcon, SpinnerIcon } from "@use-pico/client/icon";
import { BadgeValue } from "@use-pico/client/ui/badge";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { Container, ContainerValueList } from "@use-pico/client/ui/container";
import { Data } from "@use-pico/client/ui/data";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { Tx } from "@use-pico/client/ui/tx";
import { Typo } from "@use-pico/client/ui/typo";
import { VariantProvider } from "@use-pico/cls";
import type { tFeedCreate, tFeedPatch } from "@zbav-se.me/sdk/api/session";
import {
	withFeedCreateMutation,
	withFeedPatchMutation,
} from "@zbav-se.me/sdk/mutation";
import {
	withCategoryCollectionQuery,
	withLocationFetchQuery,
} from "@zbav-se.me/sdk/query";
import { ThemeCls } from "@zbav-se.me/ui/cls";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { SendPackageIcon } from "@zbav-se.me/ui/icon";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

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

		const locationFetchQuery = withLocationFetchQuery.useQuery(
			{
				where: {
					id: state.locationId,
				},
			},
			{
				enabled: !!state.locationId,
			},
		);

		const categoryCollectionQuery = withCategoryCollectionQuery.useQuery(
			{
				where: {
					idIn: state.filter?.categoryIdIn,
				},
			},
			{
				enabled: !!state.filter?.categoryIdIn?.length,
			},
		);

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

		const feedPatchMutation = withFeedPatchMutation.useMutation({
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

		const isLoading =
			feedCreateMutation.isPending || feedPatchMutation.isPending;

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
							if (state.id) {
								feedPatchMutation.mutate(state as tFeedPatch);
								return;
							}

							feedCreateMutation.mutate(state as tFeedCreate);
						}}
					/>
				}
			>
				
			</TitleContainer>
		);
	},
});
