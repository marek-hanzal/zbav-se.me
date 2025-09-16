import { createFileRoute } from "@tanstack/react-router";
import { Container } from "~/app/ui/container/Container";

export const Route = createFileRoute("/$locale/n/test")({
	component() {
		return (
			<Container
				orientation="horizontal-full"
				snap="horizontal-start"
			>
				<Container
					item="full"
					tweak={({ what }) => ({
						slot: what.slot({
							root: what.css([
								"bg-blue-300",
							]),
						}),
					})}
				/>
				<Container
					item="full"
					tweak={({ what }) => ({
						slot: what.slot({
							root: what.css([
								"bg-red-300",
							]),
						}),
					})}
				/>
				<Container
					item="full"
					tweak={({ what }) => ({
						slot: what.slot({
							root: what.css([
								"bg-pink-300",
							]),
						}),
					})}
				/>
			</Container>
		);
	},
});
