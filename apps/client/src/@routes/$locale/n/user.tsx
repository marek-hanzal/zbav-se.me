import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { Button, Container, ls, Tx, UserIcon } from "@use-pico/client";
import { withPasskeyMutation } from "~/app/auth/withPasskeyMutation";
import { withSignOutMutation } from "~/app/auth/withSignOutMutation";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/user")({
	component() {
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

		const passkeyMutation = withPasskeyMutation.useMutation({
			onError(error) {
				console.error(error);
			},
		});

		return (
			<Container layout={"vertical"}>
				<Title icon={UserIcon}>
					<Tx
						label={"User (title)"}
						size={"xl"}
						font={"bold"}
					/>
				</Title>

				<div
					className={"inline-flex flex-row gap-4 items-center w-full"}
				>
					<Button
						onClick={() => {
							ls.remove("intro");
							ls.remove("intro.listing");
						}}
					>
						<Tx label={"Reset tours (button)"} />
					</Button>

					<Button onClick={() => signOutMutation.mutate({})}>
						<Tx label={"Sign out"} />
					</Button>

					<Button
						onClick={() => {
							passkeyMutation.mutate("zbav-se.me");
						}}
					>
						<Tx label={"Add passkey"} />
					</Button>
				</div>

				<Nav active="user" />
			</Container>
		);
	},
});
