import { createFileRoute } from "@tanstack/react-router";
import { useSelection } from "@use-pico/client/hook";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { SpinnerContainer } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import type { EntitySchema } from "@use-pico/common/schema";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { uiBackButton } from "@zbav-se.me/ui/ui";
import { Suspense } from "react";
import { CategorySelect } from "~/app/category/ui/CategorySelect";
import { ListingWizardSchema } from "~/app/listing/schema/ListingWizardSchema";

export const Route = createFileRoute("/$locale/seller/listing/no-wizard/category")({
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
				data-ui="Category-root"
				textTitle={"Listing category (title)"}
				left={
					<LinkTo
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller/listing/wizard/photos"}
						search={state}
						params={{
							locale,
						}}
					/>
				}
				right={
					<ConfirmButton
						iconEnabled={CloseIcon}
						ui={{
							tone: "secondary",
						}}
						confirmProps={{
							ui: {
								tone: "danger",
							},
							onClick: () => {
								navigate({
									to: "/$locale/ui/seller",
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
					>
						<Button
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Next - condition (button)"}
							disabled={!selection.hasAny}
							ui={{
								tone: "secondary",
								theme: "dark",
								size: "lg",
							}}
						/>
					</LinkTo>
				}
			>
				<Suspense fallback={<SpinnerContainer />}>
					<CategorySelect
						locale={locale}
						selection={selection}
						categoryId={state.categoryId}
					/>
				</Suspense>
			</TitleContainer>
		);
	},
});
