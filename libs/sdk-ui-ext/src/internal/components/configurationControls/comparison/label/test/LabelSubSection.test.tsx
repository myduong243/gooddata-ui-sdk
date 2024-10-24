// (C) 2023 GoodData Corporation
import React from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import { InternalIntlWrapper } from "../../../../../utils/internalIntlProvider.js";
import { createTestProperties } from "../../../../../tests/testDataProvider.js";
import { IComparisonControlProperties } from "../../../../../interfaces/ControlProperties.js";
import LabelSubSection from "../LabelSubSection.js";
import * as InputControl from "../../../InputControl.js";
import { COMPARISON_LABEL_UNCONDITIONAL_VALUE_PATH } from "../../ComparisonValuePath.js";
import { comparisonMessages } from "../../../../../../locales.js";
import { IVisualizationProperties } from "../../../../../interfaces/Visualization.js";

const TITLE_TEXT_QUERY = "Label";
const DEFAULT_LABEL_KEY = "visualizations.headline.comparison.title.ratio";

describe("LabelSubSection", () => {
    const mockPushData = vi.fn();

    const DEFAULT_PROPS = {
        sectionDisabled: false,
        defaultLabelKey: DEFAULT_LABEL_KEY,
        properties: createTestProperties<IComparisonControlProperties>({
            comparison: {
                enabled: true,
            },
        }),
        pushData: mockPushData,
    };

    const renderValueSubSection = (
        params: {
            properties?: IVisualizationProperties<IComparisonControlProperties>;
        } = {},
    ) => {
        const props = {
            ...DEFAULT_PROPS,
            ...params,
        };

        return render(
            <InternalIntlWrapper>
                <LabelSubSection {...props} />
            </InternalIntlWrapper>,
        );
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("Should render title correctly", () => {
        const { getByText } = renderValueSubSection();
        expect(getByText(TITLE_TEXT_QUERY)).toBeInTheDocument();
    });

    it("Should render label input control", () => {
        const MockInputControl = vi.spyOn(InputControl, "default");
        renderValueSubSection();

        const { sectionDisabled, defaultLabelKey, ...expected } = DEFAULT_PROPS;
        expect(MockInputControl).toHaveBeenCalledWith(
            expect.objectContaining({
                ...expected,
                disabled: sectionDisabled,
                type: "text",
                valuePath: COMPARISON_LABEL_UNCONDITIONAL_VALUE_PATH,
                labelText: comparisonMessages.labelNameTitle.id,
                placeholder: defaultLabelKey,
                value: "of",
            }),
            expect.anything(),
        );
    });

    it("Should render label input control with value in label config", () => {
        const { container } = renderValueSubSection({
            properties: createTestProperties<IComparisonControlProperties>({
                comparison: {
                    enabled: true,
                    labelConfig: {
                        unconditionalValue: "test",
                    },
                },
            }),
        });

        expect(container.querySelector(".gd-input-field").getAttribute("value")).toEqual("test");
    });
});
