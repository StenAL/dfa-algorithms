import { mount } from "enzyme";
import React from "react";
import { act } from "react-dom/test-utils";
import { BrowserRouter } from "react-router-dom";
import { exampleDfa1 } from "../../../algorithm/data/exampleData";
import { serializeDfa } from "../../../util/util";
import UploadDfa from "./UploadDfa";

it("loads correct data from file", function (done) {
    const callback = jest.fn();
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <UploadDfa callback={callback} {...props} />
                </BrowserRouter>
            ),
            {
                runCallback: callback,
            }
        )
    );
    const data = JSON.stringify(serializeDfa(exampleDfa1));
    const file = { text: () => data };

    const fileInput = wrapper.find("input");
    fileInput.simulate("change", { target: { files: { item: () => file } } });

    setImmediate(() => {
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenLastCalledWith(exampleDfa1);
        done();
    });
});

it("rejects incorrect files", async function () {
    const callback = jest.fn();
    const wrapper = mount(
        React.createElement(
            (props) => (
                <BrowserRouter>
                    <UploadDfa callback={callback} {...props} />
                </BrowserRouter>
            ),
            {
                runCallback: callback,
            }
        )
    );
    const data = "invalid";
    const file = { text: () => data };

    const fileInput = wrapper.find("input");
    await act(async () => {
        await fileInput.simulate("change", { target: { files: { item: () => file } } });
    });

    setImmediate(() => {
        expect(callback).toHaveBeenCalledTimes(0);
        expect(wrapper.text()).toContain("Invalid input");
    });
});
