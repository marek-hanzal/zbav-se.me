import {
	createFileRoute,
	useLoaderData,
	useNavigate,
	useParams,
	useRouter,
} from "@tanstack/react-router";
import { Button, Container, LinkTo, Status, UserIcon } from "@use-pico/client";
import { linkTo } from "@use-pico/common";
import { DashboardIcon, LockIcon, PrimaryOverlay, Sheet } from "@zbav-se.me/ui";
import { withSignOutMutation } from "~/app/auth/withSignOutMutation";
import { LocationSelection } from "~/app/location/ui/LocationSelection";
import { withUserExPatchMutation } from "~/app/user/mutation/withUserExPatchMutation";

export const Route = createFileRoute("/$locale/user")({
	component() {
		const { user } = useLoaderData({
			from: "/$locale",
		});
		const router = useRouter();
		const navigate = useNavigate();
		const { locale } = useParams({
			from: "/$locale",
		});

		const useExPatchMutation = withUserExPatchMutation.useMutation({
			async onPostMutation() {
				return router.invalidate();
			},
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
					</div>
				</Sheet>

				<Sheet>
					<LocationSelection
						locale={locale}
						value={user.locationId ?? undefined}
						onChange={(value) => {
							useExPatchMutation.mutate({
								locationId: value,
							});
						}}
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
