import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { BackHomeButton } from "~/common/nav/BackHomeButton";
import { CheckIcon } from "~/common/ui/icon";
import { uiCtaLinkButton } from "~/common/ui/ui";
import { HomeMenuButton } from "~/user/home/HomeMenu/HomeMenuButton";
import { checkoutReturnSyncFn } from "~/user/stripe/fn/checkoutReturnSyncFn";
import type { CheckoutReturnSyncResultSchema } from "~/user/stripe/server/schema/CheckoutReturnSyncResultSchema";
import { TitleContainer } from "~/common/ui/container";

const ShopSuccessSearchSchema = z
	.object({
		session_id: z.string().min(1),
	})
	.strip();

const toBundleLabel = (
	translator: ReturnType<typeof useTranslator>,
	bundle: CheckoutReturnSyncResultSchema.Type["bundle"],
) => {
	switch (bundle) {
		case "package:buyer":
			return translator.text("Buyer subscription (label)", "Kupující");
		case "package:seller":
			return translator.text("Seller subscription (label)", "Prodejce");
		case "package:pro":
			return translator.text("Pro subscription (label)", "Pro");
		case "package:master":
			return translator.text("Master subscription (label)", "Master");
		case "extra:token:small":
			return translator.text("Small token bundle (label)", "malý tokenový balíček");
		case "extra:token:medium":
			return translator.text("Medium token bundle (label)", "střední tokenový balíček");
		case "extra:token:large":
			return translator.text("Large token bundle (label)", "velký tokenový balíček");
		default:
			return bundle ?? translator.text("Checkout payment (label)", "platbu");
	}
};

const toSuccessMessage = (
	translator: ReturnType<typeof useTranslator>,
	bundle: CheckoutReturnSyncResultSchema.Type["bundle"],
) => {
	const bundleLabel = toBundleLabel(translator, bundle);

	if (bundle?.startsWith("package:")) {
		return translator.text(
			"Shop success subscription (message)",
			`Tvoje ${bundleLabel} předplatné běží.`,
		);
	}

	if (bundle?.startsWith("extra:token:")) {
		return translator.text(
			"Shop success tokens (message)",
			`Tvoje ${bundleLabel} jsme připsali.`,
		);
	}

	return translator.text(
		"Shop success generic (message)",
		"Návrat ze Stripe jsme ověřili a stav jsme srovnali.",
	);
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
		const translator = useTranslator();

		return (
			<TitleContainer
				textTitle={translator.text("Shop success (title)", "Hotovo")}
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
						textTitle={translator.text(
							"Shop success status (title)",
							"Platba proběhla",
						)}
						textMessage={toSuccessMessage(translator, result.bundle)}
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
