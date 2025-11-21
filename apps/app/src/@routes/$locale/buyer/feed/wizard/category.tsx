import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { EntitySchema } from "@use-pico/common/schema";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { FeedWizardSchema } from "~/app/@buyer/feed/schema/FeedWizardSchema";
import { CategorySelectionContainer } from "~/app/category/ui/CategorySelectionContainer";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/category")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const selection = useSelection<EntitySchema.Type>({
			mode: "multi",
			initial: state.query?.filter?.categoryIdIn?.map((id) => ({
				id,
			})),
		});

		const categoryIds = selection.optional.multiId();

		return (
			<TitleContainer
				textTitle={"Feed category (title)"}
				left={
					<LinkTo
						icon={ArrowLeftIcon}
						to={"/$locale/buyer/feed/wizard/sort"}
						params={{
							locale,
						}}
						search={state}
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
					<LinkTo
						to={"/$locale/buyer/feed/wizard/condition"}
						params={{
							locale,
						}}
						search={{
							...state,
							query: {
								...state.query,
								filter: {
									...state.query?.filter,
									categoryIdIn: categoryIds,
								},
							},
						}}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							size={"lg"}
							label={"Next - feed condition (button)"}
							full
						/>
					</LinkTo>
				}
			>
				<CategorySelectionContainer
					selection={selection}
					categoryId={selection.optional.singleId()}
				/>
			</TitleContainer>
		);
	},
});
