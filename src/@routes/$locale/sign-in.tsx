import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { z } from "zod";
import { Container } from "~/ui/ui/Container";
import { Fade } from "~/ui/ui/Fade";
import { WithEmail } from "~/user-auth/ui/WithEmail";
import { WithMagic } from "~/user-auth/ui/WithMagic";

const appOrigin = import.meta.env.VITE_ORIGIN;

const SignInSearchSchema = z
	.looseObject({
		target: z
			.string()
			.optional()
			.transform((target) => {
				return appOrigin && target?.startsWith(appOrigin) ? target : undefined;
			}),
	})
	.strip();

export const Route = createFileRoute("/$locale/sign-in")({
	validateSearch: SignInSearchSchema,
	component: RouteComponent,
});

function RouteComponent() {
	const { target } = Route.useSearch();

	const rootRef = useRef<HTMLDivElement>(null);

	return (
		<Container
			data-ui="SignIn[Container]"
			data-ui-position="relative"
			data-ui-height="full"
		>
			<Fade scrollableRef={rootRef} />

			<Container
				ref={rootRef}
				data-ui-layout="vertical-full"
				data-ui-gap="default"
				data-ui-snap="vertical"
				data-ui-snap-align="center"
				data-ui-height="full"
			>
				<WithEmail target={target} />

				<WithMagic target={target} />
			</Container>
		</Container>
	);
}
