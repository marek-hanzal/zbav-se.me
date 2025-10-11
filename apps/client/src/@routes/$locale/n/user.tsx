import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import { Button, Container, ls, Tx, UserIcon } from "@use-pico/client";
import { authClient } from "~/app/auth/authClient";
import { useSignOutMutation } from "~/app/auth/useSignOutMutation";
import { Nav } from "~/app/ui/nav/Nav";
import { Title } from "~/app/ui/title/Title";

export const Route = createFileRoute("/$locale/n/user")({
	component() {
		const navigate = useNavigate();
		const { locale } = useParams({
			from: "/$locale",
		});

		const signOutMutation = useSignOutMutation.useMutation({
			onSuccess() {
				navigate({
					to: "/$locale/login",
					params: {
						locale,
					},
				});
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

				<Container height={"full"}>
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
						onClick={async () => {
							await authClient.passkey.addPasskey({
								name: "example-passkey-name",
								authenticatorAttachment: "cross-platform",
							});
						}}
					>
						<Tx label={"Add passkey"} />
					</Button>
				</Container>

				<Nav active="user" />
			</Container>
		);
	},
});
