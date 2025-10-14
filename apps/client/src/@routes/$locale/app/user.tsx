import {
	createFileRoute,
	useLoaderData,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import {
	Button,
	Container,
	LinkTo,
	Status,
	Tx,
	UserIcon,
} from "@use-pico/client";
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
				// tone={"primary"}
				// theme={"light"}
				gap={"md"}
			>
				<PrimaryOverlay />

				<Sheet>
					<div className="flex flex-col gap-4 items-center justify-evenly h-full">
						<Status
							icon={UserIcon}
							textTitle={user.email}
							textMessage={user.name}
						>
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
								>
									<Tx label={"Back to Dashboard (label)"} />
								</Button>
							</LinkTo>
						</Status>
					</div>
				</Sheet>

				<Sheet>
					<Status
						icon={LockIcon}
						textTitle={<Tx label={"Logout (title)"} />}
						textMessage={<Tx label={"Logout (description)"} />}
					>
						<Button
							onClick={() => signOutMutation.mutate({})}
							tone="danger"
							theme={"light"}
						>
							<Tx label={"Sign out"} />
						</Button>
					</Status>
				</Sheet>
			</Container>
		);
	},
});
