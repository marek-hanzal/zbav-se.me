import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { useLocale } from "@/lib/client/locale";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import type { MarkSuspense } from "@/lib/client/type";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { withBillingInfoQuery } from "~/user/billing/query/withBillingInfoQuery";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { CheckoutButton } from "./CheckoutButton/CheckoutButton";

export namespace ShopPage {
	export interface Props extends TitleContainer.Props, MarkSuspense.Props {
		//
	}
}

export const ShopPage: FC<ShopPage.Props> = ({ ...props }) => {
	const locale = useLocale();
	const translator = useTranslator();
	const { data: billingInfo } = withBillingInfoQuery.useSuspenseQuery({});

	return (
		<TitleContainer
			textTitle={translator.text("Shop (title)")}
			left={
				<BackHomeButton
					to="/$locale/app/home"
					params={{
						locale,
					}}
				/>
			}
			right={<HomeMenuButton />}
			{...props}
		>
			<Container
				data-ui={"ShopPage-[Content]"}
				data-ui-layout="vertical"
				data-ui-gap="lg"
				data-ui-padding="lg"
			>
				<Container
					data-ui={"ShopPage-[Buyer]"}
					data-ui-layout="vertical"
					data-ui-gap="md"
				>
					<Tx
						data-ui={"ShopPage-[BuyerTitle]"}
						label={
							billingInfo.isBuyerActive
								? "Buyer subscription active"
								: "Buyer subscription"
						}
						fallback={
							billingInfo.isBuyerActive
								? "Buyer subscription active"
								: "Buyer subscription"
						}
					/>
					<Tx
						data-ui={"ShopPage-[BuyerText]"}
						label={
							billingInfo.isBuyerActive
								? "Your buyer limits are already unlocked."
								: "Unlock higher buyer feed limits."
						}
						fallback={
							billingInfo.isBuyerActive
								? "Your buyer limits are already unlocked."
								: "Unlock higher buyer feed limits."
						}
					/>
					<CheckoutButton
						data-ui={"ShopPage-[CheckoutButton]"}
						isBuyerActive={billingInfo.isBuyerActive}
					/>
				</Container>
			</Container>
		</TitleContainer>
	);
};
