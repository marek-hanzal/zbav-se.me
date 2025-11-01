import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import {
	ArrowLeftIcon,
	ArrowRightIcon,
	CloseIcon,
} from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
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
				right={
					<LinkTo
						icon={CloseIcon}
						to={"/$locale/buyer/feed/select"}
						params={{
							locale,
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
								categoryIdIn: categoryIds,
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
