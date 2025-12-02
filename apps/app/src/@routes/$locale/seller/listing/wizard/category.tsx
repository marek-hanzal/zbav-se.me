import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { EntitySchema } from "@use-pico/common/schema";
import { CategorySelectionContainer } from "@zbav-se.me/common/category";
import { BadgeLeft } from "@zbav-se.me/ui/badge";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { Suspense } from "react";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

export const Route = createFileRoute("/$locale/seller/listing/wizard/category")({
	validateSearch: ListingWizardSchema,
	component() {
		const { locale } = Route.useParams();
		const state = Route.useSearch();
		const navigate = Route.useNavigate();
		const selection = useSelection<EntitySchema.Type>({
			mode: "single",
			initial: state.categoryId
				? [
						{
							id: state.categoryId,
						},
					]
				: undefined,
		});

		return (
			<TitleContainer
				ui="Category-root"
				textTitle={"Listing category (title)"}
				left={
					<LinkTo
						to={"/$locale/seller/listing/wizard/photos"}
						search={state}
						params={{
							locale,
						}}
					>
						<BadgeLeft />
					</LinkTo>
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
									to: "/$locale/seller",
									params: {
										locale,
									},
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/condition"}
						params={{
							locale,
						}}
						search={{
							...state,
							categoryId: selection.optional.singleId(),
						}}
						disabled={!selection.hasAny}
						full
					>
						<Button
							tone={"secondary"}
							theme={"dark"}
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - condition (button)"}
							disabled={!selection.hasAny}
							size={"lg"}
							full
						/>
					</LinkTo>
				}
			>
				<Suspense fallback={<SpinnerContainer />}>
					<CategorySelectionContainer
						locale={locale}
						selection={selection}
						categoryId={state.categoryId}
					/>
				</Suspense>
			</TitleContainer>
		);
	},
});
