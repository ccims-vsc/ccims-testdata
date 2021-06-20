import { Sdk, getSdk, CreateComponentInternalDocument, CreateComponentInternalMutationVariables, CreateLabelInternalMutationVariables, CreateArtifactInternalMutationVariables, CreateIssueInternalMutationVariables } from "./generated/graphql";
import { GraphQLClient } from 'graphql-request';
import axios from "axios";

const publicApiUrl = "http://server:8080/api/public"

/**
 * The type of the CCIMSApi used for all requests
 */
 function getSdkWrapper(sdk: Sdk) {
	return {
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
export async function getCCIMSApi(username: string, password: string): Promise<CCIMSApi> {
	const apiUrl = "http://server:8080/api";
	const client = new GraphQLClient(apiUrl, {
        headers: {
            authorization: `bearer ${await getApiSecret(username, password)}`
        }
    });
    return getSdkWrapper(getSdk(client));
}

/**
 * Checks if the api is reachable
 * does not check if login information exists
 * @returns true if the api is reachable, otherwise false
 */
 export async function isApiReachable(): Promise<boolean> {
	if (publicApiUrl != undefined) {
		try {
			const result = await axios.post(publicApiUrl, {
				query: "query { echo(input: \"available\") }"
			});

			return result.data.data.echo === "available"
		} catch(e) {
			return false;
		}
	} else {
		return false;
	}
}

/**
 * Checks if the api is reachable
 * does not check if login information exists
 * @returns true if the api is reachable, otherwise false
 */
 export async function createUser(input: {username: string, displayName: string, email: string, password: string}): Promise<string> {
	const result = await axios.post(publicApiUrl, {
        query: `mutation { registerUser(input: {username: "${input.username}", displayName: "${input.displayName}", email: "${input.email}", password: "${input.password}"}) { userId } }`
    });

    return result.data.data.registerUser.userId
}


async function getApiSecret(username: string, password: string): Promise<string> {
	const loginUrl = "http://server:8080/login";
	
    const response = await axios.post(loginUrl, {
        username: username,
        password: password
    });

    return response.data.token;
}