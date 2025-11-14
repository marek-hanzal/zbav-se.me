import { useNavigate, useParams } from "@tanstack/react-router";
import { Button } from "@use-pico/client/ui/button";
import { linkTo } from "@use-pico/common/link-to";
import { LockIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { withSignOutMutation } from "~/app/auth/withSignOutMutation";

export namespace SignOutButton {
	export interface Props extends Button.Props {
		//
	}
}

export const SignOutButton: FC<SignOutButton.Props> = ({ tweak, ...props }) => {
	const { locale } = useParams({
		from: "/$locale",
	});
	const navigate = useNavigate();
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

	return (
		<Button
			iconEnabled={LockIcon}
			onClick={() => signOutMutation.mutate({})}
			disabled={signOutMutation.isPending}
			loading={signOutMutation.isPending}
			tone={"secondary"}
			theme={"light"}
			label={"Sign out"}
			size={"lg"}
			tweak={tweak}
			{...props}
		/>
	);
};
