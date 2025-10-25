import {
	createFileRoute,
	useLoaderData,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { Button, Container, LinkTo, Status, UserIcon } from "@use-pico/client";
import { withSignOutMutation } from "~/app/auth/withSignOutMutation";
import { Sheet } from "~/app/sheet/Sheet";
import { DashboardIcon } from "~/app/ui/icon/DashboardIcon";
import { LockIcon } from "~/app/ui/icon/LockIcon";
import { PrimaryOverlay } from "~/app/ui/overlay/PrimaryOverlay";

export const Route = createFileRoute("/$locale/app/user")({
	component() {
		const { user } = useLoaderData({
			from: "/$locale/app",
		});
		const navigate = useNavigate();
		const { locale } = useParams({
			from: "/$locale",
		});

		const signOutMutation = withSignOutMutation.useMutation({
			onSuccess() {
				navigate({
					to: "/$locale/login",
					params: {
						locale,
					},
				});
			},
		});

		// const passkeyMutation = withPasskeyMutation.useMutation({
		// 	onError(error) {
		// 		console.error(error);
		// 	},
		// });

		return (
			<Container
				layout={"vertical-full"}
				overflow={"vertical"}
				snap={"vertical-start"}
				gap={"md"}
			>
				<PrimaryOverlay />

				<Sheet>
					<div className="flex flex-col gap-4 items-center justify-evenly h-full">
						<Status
							icon={UserIcon}
							textTitle={user.email}
							textMessage={user.name}
							action={
								<LinkTo
									to={"/$locale/app/dashboard"}
									params={{
										locale,
									}}
									tone="unset"
									theme="unset"
								>
									<Button
										iconEnabled={DashboardIcon}
										tone="secondary"
										theme="light"
										label={"Back to Dashboard (label)"}
									/>
								</LinkTo>
							}
						/>
					</div>
				</Sheet>

				<Sheet>
					<Status
						icon={LockIcon}
						textTitle={"Logout (title)"}
						textMessage={"Logout (description)"}
						action={
							<Button
								onClick={() => signOutMutation.mutate({})}
								tone="danger"
								theme={"light"}
								label={"Sign out"}
							/>
						}
					/>
				</Sheet>
			</Container>
		);
	},
});
