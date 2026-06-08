import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { Status } from "@/lib/client/status";
import { Tx } from "@/lib/client/tx";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { TitleContainer } from "~/common/ui/container";
import { CheckIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { checkoutReturnSyncFn } from "~/user/stripe/fn/checkoutReturnSyncFn";
import type { CheckoutReturnSyncResultSchema } from "~/user/stripe/server/schema/CheckoutReturnSyncResultSchema";

const ShopSuccessSearchSchema = z
	.object({
		session_id: z.string().min(1),
	})
	.strip();

const toSuccessMessageKey = (bundle: CheckoutReturnSyncResultSchema.Type["bundle"]) => {
	return bundle ? `Shop success - ${bundle} (message)` : "Shop success generic (message)";
};

export const Route = createFileRoute("/$locale/app/shop/success")({
	validateSearch: ShopSuccessSearchSchema,
	loaderDeps({ search }) {
		return search;
	},
	async loader({ deps: search }) {
		return checkoutReturnSyncFn({
			data: {
				sessionId: search.session_id,
			},
		});
	},
	component() {
		const { locale } = Route.useParams();
		const result = Route.useLoaderData();

		return (
			<TitleContainer
				textTitle="Shop success (title)"
				left={
					<BackHomeButton
						to="/$locale/app/home"
						params={{
							locale,
						}}
					/>
				}
				right={<HomeMenuButton />}
			>
				<Container data-ui-layout="vertical-centered">
					<Status
						icon={CheckIcon}
						textTitle="Shop success status (title)"
						textMessage={toSuccessMessageKey(result.bundle)}
						data-ui-tone="brand"
						data-ui-theme="light"
						data-ui-color="lead"
						action={
							<LinkTo
								data-action="goto shop browse"
								icon={ChevronRightIcon}
								iconPosition="right"
								to="/$locale/app/shop/browse"
								params={{
									locale,
								}}
								{...uiCtaLinkButton({})}
							>
								<Tx label="Back to shop (button)" />
							</LinkTo>
						}
					/>
				</Container>
			</TitleContainer>
		);
	},
});
