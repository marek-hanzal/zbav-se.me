import { useRouter } from "@tanstack/react-router";
import type { FC } from "react";
import { Container } from "@/lib/client/container";
import { ChevronRightIcon } from "@/lib/client/icon";
import { LinkTo } from "@/lib/client/link-to";
import { useLocale } from "@/lib/client/locale";
import { Status } from "@/lib/client/status";
import { useTranslator } from "@/lib/client/translation";
import { Tx } from "@/lib/client/tx";
import { FlowContainer } from "~/common/ui/container";
import { Logo } from "~/common/ui/logo";
import { uiCtaLinkButton } from "~/common/ui/ui";

export namespace PublicListingUnavailablePage {
	export interface Props extends FlowContainer.Props {
		listingId: string;
	}
}

export const PublicListingUnavailablePage: FC<PublicListingUnavailablePage.Props> = ({
	listingId,
	...props
}) => {
	const locale = useLocale();
	const translator = useTranslator();
	const router = useRouter();

	return (
		<FlowContainer
			data-ui={"PublicListingUnavailablePage"}
			data-ui-layout="vertical-header-content"
			data-ui-inner="default"
			{...props}
		>
			<Container
				data-ui-flow="horizontal"
				data-ui-items="center"
				data-ui-justify="center"
				data-ui-inner="default"
			>
				<LinkTo
					to={"/$locale/landing"}
					params={{
						locale,
					}}
					data-ui-width="content"
				>
					<Logo />
				</LinkTo>
			</Container>

			<Container
				data-ui-layout="vertical-centered"
				data-ui-height="full"
				data-ui-width="full"
			>
				<Status
					icon="icon-[solar--lock-keyhole-linear]"
					iconProps={{
						"data-ui-text": "4xl",
					}}
					textTitle={translator.text("Listing unavailable (title)")}
					textMessage={translator.text("Listing unavailable (message)")}
					messageProps={{
						className: "text-center",
					}}
					action={
						<LinkTo
							data-action={"go to sign in"}
							icon={ChevronRightIcon}
							iconPosition={"right"}
							to="/$locale/sign-in"
							params={{
								locale,
							}}
							search={{
								target: new URL(
									router.buildLocation({
										to: "/$locale/app/buyer/listing/$id/view",
										params: {
											locale,
											id: listingId,
										},
									}).href,
									import.meta.env.VITE_ORIGIN,
								).toString(),
							}}
							{...uiCtaLinkButton({})}
						>
							<Tx label="Go to sign-in (label)" />
						</LinkTo>
					}
					data-ui-tone="primary"
					data-ui-theme="light"
					data-ui-color="lead"
					data-ui-inner="4xl"
				/>
			</Container>
		</FlowContainer>
	);
};
