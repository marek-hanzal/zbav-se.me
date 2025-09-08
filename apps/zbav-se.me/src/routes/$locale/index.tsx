import { createFileRoute, useParams } from "@tanstack/react-router";

export const Route = createFileRoute("/$locale/")({
	component() {
		const { locale } = useParams({
			from: "/$locale",
		});

		return <div className="font-limelight text-4xl">bello</div>;
	},
});
