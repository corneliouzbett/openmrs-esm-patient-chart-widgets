import React from "react";

import { BrowserRouter } from "react-router-dom";

import { render, screen, fireEvent } from "@testing-library/react";
import { of } from "rxjs/internal/observable/of";

import { performPatientConditionsSearch } from "./conditions.resource";
import ConditionsOverview from "./conditions-overview.component";
import { mockPatientConditionsResult } from "../../../__mocks__/conditions.mock";
import { openWorkspaceTab } from "../shared-utils";
import { ConditionsForm } from "./conditions-form.component";

const mockOpenWorkspaceTab = openWorkspaceTab as jest.Mock;
const mockPerformPatientConditionsSearch = performPatientConditionsSearch as jest.Mock;

const renderConditionsOverview = () => {
  render(
    <BrowserRouter>
      <ConditionsOverview basePath="/" />
    </BrowserRouter>
  );
};

jest.mock("./conditions.resource", () => ({
  performPatientConditionsSearch: jest.fn()
}));

jest.mock("../shared-utils", () => ({
  openWorkspaceTab: jest.fn()
}));

describe("<ConditionsOverview />", () => {
  beforeEach(() => {
    mockOpenWorkspaceTab.mockReset;
  });

  it("should display the patient conditions", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(
      of(mockPatientConditionsResult)
    );

    renderConditionsOverview();

    await screen.findByText("Conditions");

    expect(screen.getByText("Conditions")).toBeInTheDocument();

    expect(screen.getByText("Active Conditions")).toBeInTheDocument();
    expect(screen.getByText("Since")).toBeInTheDocument();
    expect(screen.getByText("Malaria, confirmed")).toBeInTheDocument();
    expect(screen.getByText("Nov-2019")).toBeInTheDocument();
    expect(screen.getByText("Anaemia")).toBeInTheDocument();
    expect(screen.getByText("Feb-2019")).toBeInTheDocument();
    expect(screen.getByText("Anosmia")).toBeInTheDocument();
    expect(screen.getByText("Oct-2020")).toBeInTheDocument();
    expect(
      screen.getByText(/Generalized skin infection due to AIDS/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Jun-2020")).toBeInTheDocument();
  });

  it("renders an empty state view when conditions data is absent", async () => {
    mockPerformPatientConditionsSearch.mockReturnValue(of([]));

    renderConditionsOverview();

    await screen.findByText("Conditions");

    expect(screen.getByText("Conditions")).toBeInTheDocument();

    expect(
      screen.getByText(/There are no conditions to display for this patient/)
    ).toBeInTheDocument();
  });
});
