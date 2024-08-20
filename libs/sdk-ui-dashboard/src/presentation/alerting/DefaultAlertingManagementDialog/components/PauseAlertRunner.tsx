// (C) 2022-2024 GoodData Corporation

import React, { useCallback, useEffect } from "react";
import { IAutomationMetadataObject, IAutomationMetadataObjectDefinition } from "@gooddata/sdk-model";
import { GoodDataSdkError } from "@gooddata/sdk-ui";

import { useUpdateAlert } from "../../../widget/index.js";

interface IPauseAlertRunnerProps {
    alert: IAutomationMetadataObject | null;
    pause: boolean;
    onSuccess?: (
        alert: IAutomationMetadataObject | IAutomationMetadataObjectDefinition,
        pause: boolean,
    ) => void;
    onError?: (error: GoodDataSdkError, pause: boolean) => void;
}

export const PauseAlertRunner: React.FC<IPauseAlertRunnerProps> = (props) => {
    const { alert, pause, onSuccess, onError } = props;

    const { save } = useUpdateAlert({
        onSuccess: () => {
            if (alert) {
                onSuccess?.(alert, pause);
            }
        },
        onError: (error) => {
            onError?.(error as GoodDataSdkError, pause);
        },
    });

    const handlerPauseAlert = useCallback(async () => {
        if (!alert) {
            return;
        }
        save({
            ...alert,
            ...(alert.alert
                ? {
                      alert: {
                          ...alert.alert,
                          trigger: {
                              ...alert.alert?.trigger,
                              state: pause ? "PAUSED" : "ACTIVE",
                          },
                      },
                  }
                : {}),
        });
    }, [alert, pause, save]);

    useEffect(() => {
        void handlerPauseAlert();
    }, [handlerPauseAlert, alert]);

    return null;
};