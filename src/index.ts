import { getCCIMSApi } from "./api";
import { IssueCategory } from "./generated/graphql";

main();

async function main() {
    const api = getCCIMSApi();

    const userId = await api.createUser({
        username: "test-user100",
        displayName: "Test User",
        email: "test100@test.com",
        password: "test-password"
    });

    const componentId = await api.createComponent({
        name: "Hello world component",
        description: "The description of my component"
    });

    const labelId = await api.createLabel({
        components: [componentId],
        name: "Bug",
        description: "A bug on the component",
        color: "#ff0000"
    });

    const artifactId = await api.createArtifact({
        component: componentId,
        uri: "http://github.com/IDontKnow",
        lineRangeStart: 1,
        lineRangeEnd: 10
    })

    const issueId = await api.createIssue({
        component: componentId,
        title: "Hello world",
        body: "Hello body",
        category: IssueCategory.Bug,
        isOpen: true,
        labels: [labelId],
        artifacts: [artifactId],
        assignees: [userId],
        linkedIssues: []
    });
}
