// (C) 2021-2024 GoodData Corporation
import { ISettings } from "@gooddata/sdk-model";
import { getHost } from "../support/constants";
import VisitOptions = Cypress.VisitOptions;
import { DashboardMenu } from "./dashboardMenu";

declare global {
    interface Window {
        customWorkspaceSettings: any;
        useSafeWidgetLocalIdentifiersForE2e: boolean;
    }
}

const VISIT_TIMEOUT = 40000;
const CONFIRM_BUTTON = ".s-create_dashboard";
const defaultFeatureFlagsOverride: ISettings = {};

function visitUrl(url: string, options: Partial<VisitOptions>) {
    cy.visit(url, {
        timeout: VISIT_TIMEOUT,
        ...options,
    });
}

export function visitUrlWithWorkspaceSettings(url: string, workspaceSettings?: ISettings): void {
    visitUrl(url, {
        onBeforeLoad(win: Cypress.AUTWindow) {
            win["customWorkspaceSettings"] = workspaceSettings;
            win["useSafeWidgetLocalIdentifiersForE2e"] = true;
        },
    });
}

export function visit(componentName: string, workspaceConfigs?: ISettings): void {
    visitUrlWithWorkspaceSettings(`${getHost()}/gooddata-ui-sdk?scenario=${componentName}`, {
        ...workspaceConfigs,
        ...defaultFeatureFlagsOverride,
    });
}

export function visitBoilerApp(workspaceSettings?: ISettings): void {
    visitUrl(`${getHost()}`, {
        onBeforeLoad(win: Cypress.AUTWindow) {
            win["customWorkspaceSettings"] = workspaceSettings;
        },
    });
}

export function visitCopyOf(componentName: string, workspaceConfigs?: ISettings) {
    visitUrlWithWorkspaceSettings(componentName, {
        ...workspaceConfigs,
        ...defaultFeatureFlagsOverride,
    });
    new DashboardMenu().toggle().clickOption("Save as new");
    cy.get(CONFIRM_BUTTON).click();
}
