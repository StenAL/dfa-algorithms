import { shallow } from "enzyme";
import React from "react";
import { exampleDfa1 } from "../../../algorithm/data/exampleData";
import { serializeDfa } from "../../../util/util";
import DownloadButton from "./DownloadButton";

it("saving input to file works", function (done) {
    const consoleError = console.error;
    console.error = jest.fn(); // temporarily mock this to avoid JSDOM error about navigation
    const createUrlMock = jest.fn((_) => "fake-url");
    global.URL.createObjectURL = createUrlMock;
    const wrapper = shallow(
        <DownloadButton disabled={false} text={"download"} dfa1={exampleDfa1} dfa2={undefined} />
    );

    let button = wrapper.find("button").at(0);
    button.simulate("click");

    expect(createUrlMock).toHaveBeenCalledTimes(1);
    const argument = createUrlMock.mock.calls[0][0] as Blob;

    const reader = new FileReader();
    reader.addEventListener("loadend", function (_) {
        expect(reader.result).toEqual(
            JSON.stringify({ input1: JSON.stringify(serializeDfa(exampleDfa1)), input2: "0" })
        );
        console.error = consoleError;
        done();
    });

    reader.readAsText(argument);
});
