import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { Button } from "~/ui/kit/Button";

export const meta: MetaFunction = () => {
	return [{ title: "zbav-se.me" }];
};

export default function Index() {
	return (
		<div className="bg-slate-100 p-4 font-sans">
			<Link to={"/auth/sign-up"}>
				<Button>[login]</Button>
			</Link>
		</div>
	);
}
