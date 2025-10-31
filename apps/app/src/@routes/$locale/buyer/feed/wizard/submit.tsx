import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeftIcon, Button, LinkTo, Status } from "@use-pico/client";
import type { tFeedCreate, tFeedPatch } from "@zbav-se.me/sdk";
import { FeedIcon, TitleContainer } from "@zbav-se.me/ui";
import { withFeedCreateMutation } from "~/app/feed/mutation/withFeedCreateMutation";
import { withFeedPatchMutation } from "~/app/feed/mutation/withFeedPatchMutation";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/submit")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = useNavigate();

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
						params={{
							locale,
						}}
						search={{
							...state,
						}}
						tone={"secondary"}
					/>
				}
			>
				<Status
					icon={FeedIcon}
					textTitle={"Feed submit - all set (title)"}
					action={
						<Button
							label={"Submit - feed (button)"}
							tone={"secondary"}
							theme={"dark"}
							size={"lg"}
							disabled={isLoading}
							loading={isLoading}
							onClick={() => {
								/**
								 * Validation is done in the mutation itself.
								 */
								if (state.id) {
									feedPatchMutation.mutate(
										state as tFeedPatch,
									);
									return;
								}

								feedCreateMutation.mutate(state as tFeedCreate);
							}}
						/>
					}
				/>
			</TitleContainer>
		);
	},
});
