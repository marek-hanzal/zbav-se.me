import { applySchema } from "composable-functions";
import { CredentialsSchema } from "~/lib/schema/CredentialsSchema";

export const signUp = applySchema(CredentialsSchema)(async (credentials) => {
	//
	return true;
});

signUp({});
