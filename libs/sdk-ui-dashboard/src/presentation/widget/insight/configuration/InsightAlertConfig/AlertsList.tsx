// (C) 2022-2024 GoodData Corporation
import React from "react";
import { IAutomationMetadataObject } from "@gooddata/sdk-model";
import { AddButton, SeparatorLine } from "@gooddata/sdk-ui-kit";
import { AlertsListItem } from "./AlertsListItem.js";
import { DashboardInsightSubmenuContainer } from "../../../insightMenu/DefaultDashboardInsightMenu/DashboardInsightMenu/DashboardInsightSubmenuContainer.js";
import { FormattedMessage, useIntl } from "react-intl";

interface IAlertsListProps {
    alerts: IAutomationMetadataObject[];
    onCreateAlert: () => void;
    onEditAlert: (alert: IAutomationMetadataObject) => void;
    onPauseAlert: (alert: IAutomationMetadataObject) => void;
    onResumeAlert: (alert: IAutomationMetadataObject) => void;
    onDeleteAlert: (alert: IAutomationMetadataObject) => void;
    onClose: () => void;
    onGoBack: () => void;
    maxAutomationsReached: boolean;
}

export const AlertsList: React.FC<IAlertsListProps> = ({
    alerts,
    onCreateAlert,
    onEditAlert,
    onPauseAlert,
    onResumeAlert,
    onDeleteAlert,
    onClose,
    onGoBack,
    maxAutomationsReached,
}) => {
    const intl = useIntl();
    return (
        <DashboardInsightSubmenuContainer
            title={intl.formatMessage({ id: "insightAlert.config.alerts" })}
            onClose={onClose}
            onBack={onGoBack}
        >
            <div className="gd-alerts-list">
                <div className="gd-alerts-list__items">
                    {alerts.map((alert) => {
                        return (
                            <AlertsListItem
                                key={alert.id}
                                alert={alert}
                                onEditAlert={onEditAlert}
                                onPauseAlert={onPauseAlert}
                                onResumeAlert={onResumeAlert}
                                onDeleteAlert={onDeleteAlert}
                            />
                        );
                    })}
                </div>
                <SeparatorLine pL={10} pR={10} />
                <div className="gd-alerts-list__buttons">
                    <AddButton
                        onClick={onCreateAlert}
                        title={<FormattedMessage id="insightAlert.config.addAlert" />}
                        isDisabled={maxAutomationsReached}
                        tooltip={
                            maxAutomationsReached ? (
                                <FormattedMessage id="insightAlert.maxAlertsReached" />
                            ) : undefined
                        }
                    />
                </div>
            </div>
        </DashboardInsightSubmenuContainer>
    );
};