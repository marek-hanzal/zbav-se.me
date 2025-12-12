import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@use-pico/client/icon";
import { Button, ConfirmButton } from "@use-pico/client/ui/button";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { TitleContainer } from "@zbav-se.me/ui/container";
import { ListingIcon } from "@zbav-se.me/ui/icon";
import { uiBackButton } from "@zbav-se.me/ui/ui";

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
						{...uiBackButton({
							className: [],
						})}
						icon={ArrowLeftIcon}
						to={"/$locale/ui/seller"}
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
					ui={{
						tone: "primary",
						theme: "light",
					}}
				/>
			</TitleContainer>
		);
	},
});
