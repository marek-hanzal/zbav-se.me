import { createFileRoute } from "@tanstack/react-router";
import { Container } from "~/app/ui/container/Container";

export const Route = createFileRoute("/$locale/n/test")({
	component() {
		return (
			<Container
				orientation="vertical-full"
				snap="vertical-start"
			>
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
					>
						<Container
							orientation="vertical-full"
							snap="vertical-start"
						>
							<Container
								item="full"
								tweak={({ what }) => ({
									slot: what.slot({
										root: what.css([
											"bg-green-300",
										]),
									}),
								})}
							/>
							<Container
								item="full"
								tweak={({ what }) => ({
									slot: what.slot({
										root: what.css([
											"bg-yellow-300",
										]),
									}),
								})}
							/>
							<Container
								item="full"
								tweak={({ what }) => ({
									slot: what.slot({
										root: what.css([
											"bg-purple-300",
										]),
									}),
								})}
							/>
						</Container>
					</Container>
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

				<Container
					orientation="horizontal-full"
					overflow="horizontal"
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
			</Container>
		);
	},
});
