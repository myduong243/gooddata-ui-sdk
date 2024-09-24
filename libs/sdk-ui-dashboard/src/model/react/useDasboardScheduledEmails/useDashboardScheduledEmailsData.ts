// (C) 2022-2024 GoodData Corporation
import { useMemo } from "react";
import {
    IAutomationMetadataObject,
    IExportDefinitionVisualizationObjectContent,
    isExportDefinitionVisualizationObjectRequestPayload,
} from "@gooddata/sdk-model";
import {
    selectCanExportPdf,
    selectCanManageWorkspace,
    selectEnableScheduling,
    selectIsInViewMode,
    selectIsReadOnly,
    selectMenuButtonItemsVisibility,
    selectEntitlementMaxAutomations,
    selectWebhooks,
    selectSmtps,
    selectAutomationsCount,
    selectUsers,
    selectWebhooksIsLoading,
    selectAutomationsIsLoading,
    selectWebhooksError,
    selectAutomationsError,
    selectAutomationsSchedulesInContext,
    selectEntitlementUnlimitedAutomations,
    selectCanCreateAutomation,
    selectIsScheduleEmailDialogOpen,
    selectIsScheduleEmailDialogContext,
    selectIsScheduleEmailManagementDialogOpen,
    selectWidgetByRef,
    selectInsightByWidgetRef,
} from "../../store/index.js";
import { useDashboardSelector } from "../DashboardStoreProvider.js";
/**
 * @alpha
 * Default maximum number of automations.
 */
export const DEFAULT_MAX_AUTOMATIONS = "10";

interface IUseDashboardScheduledEmailsDataProps {
    scheduledExportToEdit?: IAutomationMetadataObject;
}

/**
 * @internal
 */
export const useDashboardScheduledEmailsData = ({
    scheduledExportToEdit,
}: IUseDashboardScheduledEmailsDataProps) => {
    const users = useDashboardSelector(selectUsers);

    const emails = useDashboardSelector(selectSmtps);

    const webhooks = useDashboardSelector(selectWebhooks);
    const webhooksLoading = useDashboardSelector(selectWebhooksIsLoading);
    const webhooksError = useDashboardSelector(selectWebhooksError);

    const automations = useDashboardSelector(selectAutomationsSchedulesInContext(undefined));
    const automationsCount = useDashboardSelector(selectAutomationsCount);
    const automationsLoading = useDashboardSelector(selectAutomationsIsLoading);
    const automationsError = useDashboardSelector(selectAutomationsError);

    // Dashboard mode
    const isReadOnly = useDashboardSelector(selectIsReadOnly);
    const isInViewMode = useDashboardSelector(selectIsInViewMode);

    // Visibility configuration
    const menuButtonItemsVisibility = useDashboardSelector(selectMenuButtonItemsVisibility);

    // Feature flags
    const isScheduledEmailingEnabled = useDashboardSelector(selectEnableScheduling);

    // Permissions
    const canExport = useDashboardSelector(selectCanExportPdf);
    const isWorkspaceManager = useDashboardSelector(selectCanManageWorkspace);
    const canCreateAutomation = useDashboardSelector(selectCanCreateAutomation);

    // Entitlements
    const maxAutomationsEntitlement = useDashboardSelector(selectEntitlementMaxAutomations);
    const unlimitedAutomationsEntitlement = useDashboardSelector(selectEntitlementUnlimitedAutomations);
    const maxAutomations = parseInt(maxAutomationsEntitlement?.value ?? DEFAULT_MAX_AUTOMATIONS, 10);

    const notificationChannels = useMemo(() => [...emails, ...webhooks], [webhooks, emails]);
    const numberOfAvailableDestinations = notificationChannels.length;
    const maxAutomationsReached = automationsCount >= maxAutomations && !unlimitedAutomationsEntitlement;

    /**
     * We want to hide scheduling when there are no webhooks unless the user is admin.
     */
    const showDueToNumberOfAvailableDestinations = numberOfAvailableDestinations > 0 || isWorkspaceManager;

    const isSchedulingAvailable =
        isInViewMode &&
        !isReadOnly &&
        isScheduledEmailingEnabled &&
        canExport &&
        showDueToNumberOfAvailableDestinations &&
        (menuButtonItemsVisibility.scheduleEmailButton ?? true);

    // Single Schedule Dialog
    const isScheduledEmailingVisible = isSchedulingAvailable && canCreateAutomation && !maxAutomationsReached;
    const isScheduleEmailingDialogOpen = useDashboardSelector(selectIsScheduleEmailDialogOpen) || false;
    const scheduleEmailingDialogContext = useDashboardSelector(selectIsScheduleEmailDialogContext);

    // List / Management Dialog
    const isScheduledManagementEmailingVisible = isSchedulingAvailable && automations.length > 0;
    const isScheduleEmailingManagementDialogOpen =
        useDashboardSelector(selectIsScheduleEmailManagementDialogOpen) || false;

    // Widget and Insight
    const editWidgetId = (
        scheduledExportToEdit?.exportDefinitions?.find((exportDefinition) =>
            isExportDefinitionVisualizationObjectRequestPayload(exportDefinition.requestPayload),
        )?.requestPayload.content as IExportDefinitionVisualizationObjectContent
    )?.widget;
    const editWidgetRef = editWidgetId ? { identifier: editWidgetId } : undefined;
    const widget = useDashboardSelector(
        selectWidgetByRef(scheduleEmailingDialogContext?.widgetRef ?? editWidgetRef),
    );
    const insight = useDashboardSelector(selectInsightByWidgetRef(widget?.ref));

    return {
        // Data
        users,
        notificationChannels,
        automations,
        automationsLoading,
        automationsError,
        automationsCount,
        numberOfAvailableDestinations,
        widget,
        insight,
        webhooksLoading,
        webhooksError,
        // Single Schedule Dialog
        isScheduledEmailingVisible,
        isScheduleEmailingDialogOpen,
        // List / Management Dialog
        isScheduledManagementEmailingVisible,
        isScheduleEmailingManagementDialogOpen,
    };
};