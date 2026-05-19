import { useRouter } from "@tanstack/react-router";
import { type FC, useState } from "react";
import { Button } from "@/lib/client/button";
import { Container } from "@/lib/client/container";
import { ErrorBadge } from "@/lib/client/error";
import { useLocale } from "@/lib/client/locale";
import { Tx } from "@/lib/client/tx";
import { EmailIcon } from "~/common/ui/icon";
import { withEmailVerificationRequestMutation } from "~/user/auth/mutation/withEmailVerificationRequestMutation";

export namespace VerifyEmailButton {
	export interface Props extends Container.Props {
		email: string;
	}
}

export const VerifyEmailButton: FC<VerifyEmailButton.Props> = ({ email, ...props }) => {
	const locale = useLocale();
	const router = useRouter();
	const [isSent, setIsSent] = useState(false);
	const mutation = withEmailVerificationRequestMutation.useMutation({
		onSuccess() {
			setIsSent(true);
		},
	});

	const link = router.buildLocation({
		to: "/$locale/app/user",
		params: {
			locale,
		},
	});
	const callbackURL = new URL(link.href, import.meta.env.VITE_ORIGIN).toString();

	return (
		<Container
			data-ui="VerifyEmailButton"
			data-ui-layout="vertical-flex"
			data-ui-items="start"
			data-ui-gap="sm"
			data-ui-width="full"
			{...props}
		>
			<Button
				iconEnabled={EmailIcon}
				data-action={"send verification email"}
				onClick={() => {
					setIsSent(false);
					mutation.mutate({
						email,
						callbackURL,
					});
				}}
				disabled={mutation.isPending}
				loading={mutation.isPending}
				data-ui-tone="neutral"
				data-ui-theme="light"
				data-ui-size="md"
				data-ui-width="full"
				data-ui-text="md"
			>
				<Tx label={"Send verification email"} />
			</Button>

			{isSent ? (
				<Tx
					label={"Verification email sent. Check your inbox."}
					data-ui-text="sm"
					data-ui-color="lead"
				/>
			) : null}

			<ErrorBadge error={mutation.error} />
		</Container>
	);
};
