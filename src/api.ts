import { Sdk, getSdk, CreateUserInternalMutationVariables, CreateComponentInternalDocument, CreateComponentInternalMutationVariables, CreateLabelInternalMutationVariables, CreateArtifactInternalMutationVariables, CreateIssueInternalMutationVariables } from "./generated/graphql";
import { GraphQLClient } from 'graphql-request';

/**
 * The type of the CCIMSApi used for all requests
 */
 function getSdkWrapper(sdk: Sdk) {
	return {
		async createUser(input: CreateUserInternalMutationVariables): Promise<string> {
            const result = await sdk.createUserInternal(input);
            return result.createUser?.user?.id as string;
        },
        async createComponent(input: CreateComponentInternalMutationVariables): Promise<string> {
            const result = await sdk.createComponentInternal(input);
            return result.createComponent?.component?.id as string;
        },
        async createLabel(input: CreateLabelInternalMutationVariables): Promise<string> {
            const result = await sdk.createLabelInternal(input);
            return result.createLabel?.label?.id as string;
        },
        async createArtifact(input: CreateArtifactInternalMutationVariables): Promise<string> {
            const result = await sdk.createArtifactInternal(input);
            return result.createArtifact?.artifact?.id as string;
        },
        async createIssue(input: CreateIssueInternalMutationVariables & { linkedIssues?: string[], isOpen?: boolean }): Promise<string> {
            const result = await sdk.createIssueInternal(input);
            const id = result?.createIssue?.issue?.id as string;
            for (const linked of input.linkedIssues ?? []) {
                await sdk.linkIssueInternal({
                    issue: id,
                    linkedIssue: linked
                });
            }
            if (input.isOpen != undefined && !input.isOpen) {
                await sdk.closeIssueInternal({ id: id });
            }
            return id;
        }
	}
}

export type CCIMSApi = ReturnType<typeof getSdkWrapper>;

/**
 * Gets a new CCIMSApi
 * @returns a new instance of the CCIMSApi
 */
export function getCCIMSApi(): CCIMSApi {
	const apiUrl = "http://localhost:8080/api";
	const client = new GraphQLClient(apiUrl);
    return getSdkWrapper(getSdk(client));
}