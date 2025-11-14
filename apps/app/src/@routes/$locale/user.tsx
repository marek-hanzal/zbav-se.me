import { createFileRoute, useLoaderData, useNavigate, useParams } from "@tanstack/react-router";
import { UserIcon } from "@use-pico/client/icon";
import { Button } from "@use-pico/client/ui/button";
import { Container } from "@use-pico/client/ui/container";
import { LinkTo } from "@use-pico/client/ui/link-to";
import { Status } from "@use-pico/client/ui/status";
import { linkTo } from "@use-pico/common/link-to";
import { DashboardIcon, LockIcon } from "@zbav-se.me/ui/icon";
import { Sheet } from "@zbav-se.me/ui/sheet";
import { withSignOutMutation } from "~/app/auth/withSignOutMutation";

export const Route = createFileRoute("/$locale/user")({
	component() {
		const { user } = useLoaderData({
			from: "/$locale",
		});
		const navigate = useNavigate();
		const { locale } = useParams({
			from: "/$locale",
		});

		const signOutMutation = withSignOutMutation.useMutation({
			async onPostMutation() {
				return navigate({
					href: linkTo({
						base: import.meta.env.VITE_WEB_ORIGIN,
						href: "/:locale/landing",
						query: {
							locale,
						},
					}),
				});
			},
		});

		// const passkeyMutation = withPasskeyMutation.useMutation({
		// 	onError(error) {
		// 		console.error(error);
		// 	},
		// })

		return (
			<Container
				layout={"vertical-full"}
				snap={"vertical-start"}
				gap={"md"}
			>
				<Sheet>
					<Status
						icon={UserIcon}
						textTitle={user.email}
						textMessage={user.name}
						action={
							<LinkTo
								to={"/$locale/dashboard"}
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
				</Sheet>

				<Sheet>
					<Status
						icon={LockIcon}
						textTitle={"Logout (title)"}
						textMessage={"Logout (description)"}
						action={
							<Button
								onClick={() => signOutMutation.mutate({})}
								disabled={signOutMutation.isPending}
								loading={signOutMutation.isPending}
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
