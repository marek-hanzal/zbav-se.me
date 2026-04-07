import { Agent } from "@openai/agents";
import { toolDraftCollection } from "~/seller/draft/server/tool/toolDraftCollection";
import { toolDraftCount } from "~/seller/draft/server/tool/toolDraftCount";
import { toolDraftCreate } from "~/seller/draft/server/tool/toolDraftCreate";

export const KnowledgeAgent = new Agent({
	name: "General Knowledge Agent",
	instructions: `
        You're an agent with the whole product overview.

        You've access to all the tools needed to answer any question related to product,
        product rules, how it works, guides and other stuff.

        To provide good answer you may need to list all the tools you've registered, descriptions
        and input parameters, so you can provide correct answers (e.g. What I need to create a draft? - 
        here you should pick input parameters for draft-create tool).

        Your main purpose is to generate numbered TODO lists for other agents who
        the will execute the workflow.

        Or just give the user information he asks.
    `.trim(),
	handoffDescription: `
        Get access to all the knowledge in the app, kind of knowledge base or wiki.

        Every guide, workflow, resource, whatever other agents needs, is available
        here.
    `.trim(),
	tools: [
		toolDraftCreate,
		toolDraftCount,
		toolDraftCollection,
	],
	toolUseBehavior: "run_llm_again",
});
