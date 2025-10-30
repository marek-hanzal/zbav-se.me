import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	Button,
	Container,
	LinkTo,
	SortIcon,
	Status,
	Tx,
} from "@use-pico/client";
import { VariantProvider } from "@use-pico/cls";
import {
	FeedIcon,
	LocationIcon,
	Sheet,
	ThemeCls,
	TypoIcon,
} from "@zbav-se.me/ui";

export const Route = createFileRoute("/$locale/buyer/feed/wizard/start")({
	component() {
		const { locale } = Route.useParams();

		return (
			<Container
				ui="FeedWizard-Start-root"
				layout={"vertical-content-footer"}
				tone={"secondary"}
				theme={"light"}
				square={"md"}
				border={"default"}
				shadow={"default"}
			>
				<Sheet>
					<VariantProvider
						cls={ThemeCls}
						variant={{
							tone: "secondary",
							theme: "light",
						}}
					>
						<Status
							icon={FeedIcon}
							textTitle={"Feed - intro (title)"}
							textMessage={"Feed - intro (description)"}
							action={
								<LinkTo
									to="/$locale/buyer/feed/wizard/location"
									params={{
										locale,
									}}
								>
									<Button
										iconEnabled={ArrowRightIcon}
										iconProps={{
											size: "md",
										}}
										label={"Feed location (cta)"}
										tone={"secondary"}
										theme={"dark"}
										size={"xl"}
									/>
								</LinkTo>
							}
							tweak={{
								slot: {
									body: {
										class: [
											"flex",
											"flex-col",
											"gap-2",
											"items-start",
										],
									},
								},
							}}
						>
							<TypoIcon icon={LocationIcon}>
								<Tx label={"Feed location (hint)"} />
							</TypoIcon>

							<TypoIcon icon={SortIcon}>
								<Tx label={"Feed sorting (hint)"} />
							</TypoIcon>
						</Status>
					</VariantProvider>
				</Sheet>
			</Container>
		);
	},
});
