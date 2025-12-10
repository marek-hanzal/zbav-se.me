import { useNavigate } from "@tanstack/react-router";
import { Button } from "@use-pico/client/ui/button";
import { linkTo } from "@use-pico/common/link-to";
import { LockIcon } from "@zbav-se.me/ui/icon";
import type { FC } from "react";
import { withSignOutMutation } from "~/app/auth/withSignOutMutation";

export namespace SignOutButton {
	export interface Props extends Button.Props {
		locale: string;
	}
}

export const SignOutButton: FC<SignOutButton.Props> = ({ locale, ui, ...props }) => {
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
			label={"Sign out"}
			ui={{
				tone: "secondary",
				theme: "light",
				size: "md",
				width: "content",
				...ui,
			}}
			{...props}
		/>
	);
};
