import { createUser, getCCIMSApi, isApiReachable } from "./api";
import { IssueCategory } from "./generated/graphql";

mainIfApiAvailable();

async function mainIfApiAvailable() {
  if (await isApiReachable()) {
    console.log("enter data");
    main();
  } else {
    console.log("wait");
    setTimeout(() => mainIfApiAvailable(), 5000);
  }
}

async function main() {
  const christianId = await createUser({
    username: "testuser",
    displayName: "Christian",
    email: "test100@test.com",
    password: "test-password",
  });

  const api = await getCCIMSApi("testuser", "test-password");

  const niklasId = await createUser({
    username: "nk-coding",
    displayName: "Niklas",
    email: "test101@test.com",
    password: "test-password",
  });

  const susannaId = await createUser({
    username: "susanna",
    displayName: "Susanna",
    email: "test102@test.com",
    password: "test-password",
  });

  const engineId = await api.createComponent({
    name: "nie Engine",
    description: "Main Engine",
  });

  const oftId = await api.createComponent({
    name: "Oft",
    description: "Main game data",
    repository: "https://github.com/ccims-vsc/example-project"
  });

  const nieProjectId = await api.createProject({
    name: "Nie",
    description: "The nie project",
    components: [engineId, oftId]
  })

  const labelPlanetId = await api.createLabel({
    components: [oftId],
    name: "Planet Specific",
    description: "Feature specific for a single planet",
    color: "#0000ff",
  });

  const labelMechanicId = await api.createLabel({
    components: [oftId],
    name: "Mechanic Specific",
    description: "Feature for a game mechanic",
    color: "#0000ff",
  });

  const labelScriptFeatureId = await api.createLabel({
    components: [oftId, engineId],
    name: "Script Feature",
    description: "Feature concerning the scripting API",
    color: "#0000ff",
  });

  const labelEngineId = await api.createLabel({
    components: [engineId],
    name: "Engine Feature",
    description: "Feature internal to the Engine",
    color: "#0000ff",
  });

  const labelPackageId = await api.createLabel({
    components: [engineId],
    name: "Package Feature",
    description: "Feature for the Engine/Package api",
    color: "#0000ff",
  });

  const artifactfor3 = await api.createArtifact({
    component: oftId,
    uri: "https://github.com/ccims-vsc/example-project/blob/main/README.md",
    lineRangeStart: 17,
    lineRangeEnd: 20,
  });

  const artifactfor5 = await api.createArtifact({
    component: oftId,
    uri: "https://github.com/ccims-vsc/example-project/blob/main/oven.lua",
    lineRangeStart: 18,
    lineRangeEnd: 18,
  });

  const artifactfor3link = await api.createArtifact({
    component: oftId,
    uri: "https://youtu.be/dQw4w9WgXcQ"
  });

  const issueId1 = await api.createIssue({
    components: engineId,
    title: "Provide scenes to cycles",
    body: "Feed snapshot of scene to cycles",
    category: IssueCategory.FeatureRequest,
    isOpen: false,
    labels: [labelEngineId, labelPackageId],
    artifacts: [],
    assignees: [christianId],
    linkedIssues: [],
  });

  const issueId2 = await api.createIssue({
    components: engineId,
    title: "Live rendered cubemaps",
    body: "Render cubemaps using good renderer live on scene entry",
    category: IssueCategory.FeatureRequest,
    isOpen: true,
    labels: [labelEngineId, labelScriptFeatureId],
    artifacts: [],
    assignees: [christianId],
    linkedIssues: [issueId1],
  });

  const issueId3 = await api.createIssue({
    components: oftId,
    title: "Pizza Kawaii",
    body: "Create planet for `Pizza Kawaii`\nNeeds:\n* Eating Area\n* Kitchen Area (SB isolated)\n* Badly Visible Area",
    category: IssueCategory.FeatureRequest,
    isOpen: true,
    labels: [labelPlanetId],
    artifacts: [artifactfor3, artifactfor3link],
    assignees: [christianId],
    linkedIssues: [],
  });

  const issueId4 = await api.createIssue({
    components: oftId,
    title: "Pizza Kawaii Logo",
    body: "Logo for Pizza Kawaii",
    category: IssueCategory.FeatureRequest,
    isOpen: false,
    labels: [labelPlanetId],
    artifacts: [],
    assignees: [susannaId],
    linkedIssues: [issueId3],
  });

  await api.linkIssueInternal({issue: issueId3, linkedIssue: issueId4});

  const issueId5 = await api.createIssue({
    components: oftId,
    title: "Pizza Kawaii Pizza Baking",
    body: "Allow Backing of Pizzas",
    category: IssueCategory.FeatureRequest,
    isOpen: true,
    labels: [labelPlanetId, labelMechanicId],
    artifacts: [artifactfor5],
    assignees: [christianId],
    linkedIssues: [issueId3],
  });

  const issueId6 = await api.createIssue({
    components: oftId,
    title: "Pizza Kawaii allows wall glitch",
    body: "Running in the South-East wall of Pizza Kawaii results in the reset of the player to origin",
    category: IssueCategory.Bug,
    isOpen: true,
    labels: [labelPlanetId],
    artifacts: [],
    assignees: [christianId],
    linkedIssues: [issueId3],
  });

  const issueId7 = await api.createIssue({
    components: oftId,
    title: "Redo lighting for screenshot render",
    body: "Lighting has to be redone when using cycles instead of gl33",
    category: IssueCategory.Bug,
    isOpen: true,
    labels: [],
    artifacts: [],
    assignees: [christianId],
    linkedIssues: [issueId1],
  });

  const issueId8 = await api.createIssue({
    components: oftId,
    title: "Redo lighting for screenshot render in Pizza Kawaii",
    body: "",
    category: IssueCategory.Bug,
    isOpen: true,
    labels: [],
    artifacts: [],
    assignees: [christianId],
    linkedIssues: [issueId1, issueId7],
  });

  const issueId9 = await api.createIssue({
    components: oftId,
    title: "Add R&D back home in Core",
    body: "Add R&D Mechanic where other centrals allow for experience gain for returned artifacts",
    category: IssueCategory.FeatureRequest,
    isOpen: true,
    labels: [labelMechanicId],
    artifacts: [],
    assignees: [christianId],
    linkedIssues: [],
  });

  const issueId10 = await api.createIssue({
    components: oftId,
    title: "Missing friendly NPC in Core",
    body: "Core does not have anyone who could accept returned technology",
    category: IssueCategory.FeatureRequest,
    isOpen: true,
    labels: [labelPlanetId, labelMechanicId],
    artifacts: [],
    assignees: [niklasId, christianId],
    linkedIssues: [issueId9],
  });
}
