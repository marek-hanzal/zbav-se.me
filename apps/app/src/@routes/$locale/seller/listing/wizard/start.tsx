import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton, uiButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingIcon } from "@zbav-se.me/ui/icon";

export const Route = createFileRoute("/$locale/seller/listing/wizard/start")({
	component() {
		const { locale } = Route.useParams();
		const navigate = Route.useNavigate();

		return (
			<TitleContainer
				data-ui="Start-root"
				textTitle={"New listing (title)"}
				left={
					<LinkTo
						{...uiButton({
							ui: {
								round: "full",
								square: "default",
								opacity: "subtle",
							},
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/seller"}
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
						iconProps={{
							ui: {
								size: "md",
							},
						}}
						confirmProps={{
							ui: {
								tone: "danger",
							},
							onClick: () => {
								navigate({
									to: "/$locale/seller",
								});
							},
						}}
					/>
				}
				bottom={
					<LinkTo
						to={"/$locale/seller/listing/wizard/photos"}
						params={{
							locale,
						}}
					>
						<Button
							iconEnabled={ArrowRightIcon}
							iconPosition={"right"}
							label={"Listing - start (button)"}
							ui={{
								tone: "secondary",
								theme: "dark",
								size: "xl",
							}}
						/>
					</LinkTo>
				}
			>
				<Status
					icon={ListingIcon}
					textTitle={"Listing - start (title)"}
					textMessage={"Listing - start (text)"}
					tone={"primary"}
					theme={"light"}
				/>
			</TitleContainer>
		);
	},
});
