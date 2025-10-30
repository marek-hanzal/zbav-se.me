import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	Button,
	LinkTo,
	useSelection,
} from "@use-pico/client";
import type { EntitySchema } from "@use-pico/common";
import { TitleContainer } from "@zbav-se.me/ui";
import { CategorySelection } from "~/app/category/ui/CategorySelection";
import { FeedWizardSchema } from "~/app/feed/schema/FeedWizardSchema";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/category")({
	validateSearch: FeedWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const selection = useSelection<EntitySchema.Type>({
			mode: "multi",
			initial: state.filter?.categoryIdIn?.map((id) => ({
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
						search={{
							...state,
						}}
						tone={"secondary"}
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
							filter: {
								...state.filter,
								categoryIdIn:
									categoryIds.length > 0
										? categoryIds
										: undefined,
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
				<CategorySelection
					locale={locale}
					selection={selection}
				/>
			</TitleContainer>
		);
	},
});
