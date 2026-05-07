import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import type { FC } from "react";
import { Button } from "@/lib/client/button";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { LockIcon } from "~/common/ui/icon";
import { withSignOutMutation } from "~/user/auth/mutation/withSignOutMutation";

export namespace SignOutButton {
	export interface Props extends Button.Props {
		//
	}
}

/**
 * Encapsulates a focused sign out action behind shared app styling and behavior.
 * Use it when the sign out action should stay consistent across screens.
 */
export const SignOutButton: FC<SignOutButton.Props> = ({ ...props }) => {
	const queryClient = useQueryClient();
	const locale = useLocale();
	const navigate = useNavigate();
	const signOutMutation = withSignOutMutation.useMutation({
		async onPostMutation() {
			setTimeout(() => {
				queryClient.clear();
			}, 0);
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
			data-action={"sign out"}
			onClick={() => signOutMutation.mutate({})}
			disabled={signOutMutation.isPending}
			loading={signOutMutation.isPending}
			data-ui-tone="secondary"
			data-ui-theme="light"
			data-ui-size="md"
			data-ui-width="content"
			data-ui-text="md"
			{...props}
		>
			<Tx label="Sign out" />
		</Button>
	);
};
