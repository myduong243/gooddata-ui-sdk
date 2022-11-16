// (C) 2007-2022 GoodData Corporation
import { ScreenSize } from "@gooddata/sdk-model";
import cx from "classnames";
import React, { useMemo } from "react";
import { Col } from "react-grid-system";
import { selectDraggingWidgetTarget, useDashboardDispatch, useDashboardSelector } from "../../../model";
import { getDashboardLayoutItemHeightForGrid } from "../../layout/DefaultDashboardLayoutRenderer/utils/sizing";
import { WidgetDropZone } from "./WidgetDropZone";
import { useDashboardDrop } from "../useDashboardDrop";
import { useInsightListItemDropHandler } from "./useInsightListItemDropHandler";
import { useInsightPlaceholderDropHandler } from "./useInsightPlaceholderDropHandler";
import { useKpiPlaceholderDropHandler } from "./useKpiPlaceholderDropHandler";
import { useMoveWidgetDropHandler } from "./useMoveWidgetHandler";
import {
    BaseDraggableLayoutItem,
    isInsightDraggableItem,
    isInsightDraggableListItem,
    isInsightPlaceholderDraggableItem,
    isKpiDraggableItem,
    isKpiPlaceholderDraggableItem,
} from "../types";

export type WidgetDropZoneColumnProps = {
    screen: ScreenSize;
    sectionIndex: number;
    itemIndex: number;
    isLastInSection?: boolean;
};

export const WidgetDropZoneColumn = (props: WidgetDropZoneColumnProps) => {
    const { sectionIndex, itemIndex, isLastInSection = false } = props;

    const dropzoneCoordinates = useDashboardSelector(selectDraggingWidgetTarget);

    const handleInsightListItemDrop = useInsightListItemDropHandler(sectionIndex, itemIndex);
    const handleInsightPlaceholderDrop = useInsightPlaceholderDropHandler(sectionIndex, itemIndex);
    const handleKpiPlaceholderDrop = useKpiPlaceholderDropHandler(sectionIndex, itemIndex);
    const handleWidgetDrop = useMoveWidgetDropHandler(sectionIndex, itemIndex);

    const dispatch = useDashboardDispatch();

    const [collectedProps, dropRef] = useDashboardDrop(
        ["insightListItem", "kpi-placeholder", "insight-placeholder", "kpi", "insight"],
        {
            drop: (item) => {
                if (isInsightDraggableListItem(item)) {
                    handleInsightListItemDrop(item.insight);
                }
                if (isKpiPlaceholderDraggableItem(item)) {
                    handleKpiPlaceholderDrop();
                }
                if (isInsightPlaceholderDraggableItem(item)) {
                    handleInsightPlaceholderDrop();
                }
                if (isInsightDraggableItem(item) || isKpiDraggableItem(item)) {
                    handleWidgetDrop(item);
                }
            },
        },
        [dispatch, handleInsightListItemDrop, handleInsightPlaceholderDrop, handleKpiPlaceholderDrop],
    );

    const showDropZone = useMemo(
        () =>
            dropzoneCoordinates?.sectionIndex === sectionIndex &&
            dropzoneCoordinates?.itemIndex === itemIndex,

        [dropzoneCoordinates?.itemIndex, dropzoneCoordinates?.sectionIndex, itemIndex, sectionIndex],
    );

    if (!showDropZone) {
        return null;
    }

    const size = (collectedProps.item as BaseDraggableLayoutItem).size;

    return (
        <Col
            xl={size.gridWidth}
            lg={size.gridWidth}
            md={size.gridWidth}
            sm={size.gridWidth}
            xs={size.gridWidth}
            className={cx("gd-fluidlayout-column", "gd-fluidlayout-column-dropzone", "s-fluid-layout-column")}
            style={{
                minHeight: getDashboardLayoutItemHeightForGrid(size.gridHeight),
            }}
        >
            <WidgetDropZone
                isLastInSection={isLastInSection}
                sectionIndex={sectionIndex}
                itemIndex={itemIndex}
                dropRef={dropRef}
            />
        </Col>
    );
};