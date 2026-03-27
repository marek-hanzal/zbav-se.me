import { useNavigate } from "@tanstack/react-router";
import { useLocale } from "@use-pico/client/hook";
import { Button } from "@use-pico/client/ui/button";
import { Tx } from "@use-pico/client/ui/tx";
import type { FC } from "react";
import { withSignOutMutation } from "~/common/auth/mutation/withSignOutMutation";
import { LockIcon } from "~/common/ui/icon";

export namespace SignOutButton {
	export interface Props extends Button.Props {}
}

/**
 * Encapsulates a focused sign out action behind shared app styling and behavior.
 * Use it when the sign out action should stay consistent across screens.
 *
 * @see apps/app/src/app//draft/ui/DraftEditor/DraftEditor.tsx
 */
export const SignOutButton: FC<SignOutButton.Props> = ({ ui, ...props }) => {
	const locale = useLocale();
	const navigate = useNavigate();
	const signOutMutation = withSignOutMutation.useMutation({
		async onPostMutation() {
			return navigate({
				to: "/$locale/landing",
				params: {
					locale,
				},
			});
		},
	});

	return (
		<Button
			iconEnabled={LockIcon}
			onClick={() => signOutMutation.mutate({})}
			disabled={signOutMutation.isPending}
			loading={signOutMutation.isPending}
			ui={{
				tone: "secondary",
				theme: "light",
				size: "md",
				width: "content",
				text: "md",
				...ui,
			}}
			{...props}
		>
			<Tx label="Sign out" />
		</Button>
	);
};
