/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import ReleaseDrawer from "../index";
import { RootState } from "src/redux/rootReducers";

// Mocks
jest.mock("../helper", () => ({
  __esModule: true,
  useReleaseDrawerHelper: jest.fn(),
}));

import { useReleaseDrawerHelper } from "../helper";
const mockUseReleaseDrawerHelper = useReleaseDrawerHelper as jest.Mock;

// Render utility
const renderWithProviders = (
  ui: React.ReactElement,
  state: Partial<RootState> = {}
) => {
  const store = configureStore({ reducer: () => state });
  return render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  );
};

// Mock data
const defaultProps = {
  open: true,
  onClose: jest.fn(),
  envList: [
    {
      value: "1",
      label: "Production",
      key: "prod-key",
    },
    {
      value: "2",
      label: "Staging",
      key: "stage-key",
    },
  ],
};

const formikMock = {
  values: { name: "" },
  errors: {},
  touched: {},
  isValid: true,
  dirty: true,
  setFieldValue: jest.fn(),
  handleBlur: jest.fn(),
};

beforeAll(() => {
  Object.assign(navigator, {
    clipboard: {
      writeText: jest.fn(),
    },
  });
});

beforeEach(() => {
  mockUseReleaseDrawerHelper.mockReturnValue({
    newDeployment: false,
    handleAddNewDeployment: jest.fn(),
    handleDrawerClose: jest.fn(),
    handleSubmit: jest.fn(),
    formik: formikMock,
  });
  (navigator.clipboard.writeText as jest.Mock).mockClear();
});

describe("ReleaseDrawer", () => {
  it("renders title correctly", () => {
    renderWithProviders(<ReleaseDrawer {...defaultProps} />);
    expect(screen.getByText("Manage Deployments")).toBeInTheDocument();
  });

  it("renders environment keys with copy buttons", () => {
    renderWithProviders(<ReleaseDrawer {...defaultProps} />);
    expect(screen.getByText("Production")).toBeInTheDocument();
    expect(screen.getByText("Staging")).toBeInTheDocument();
  });

  it("copies env key to clipboard on copy button click", () => {
    const mockClipboard = { writeText: jest.fn() };
    Object.assign(navigator, { clipboard: mockClipboard });

    const mockEnvList = [
      {
        value: "env1",
        label: "Production",
        key: "prod-key",
        azureEnvId: "string",
        appId: "string",
        azureAppId: "string",
        createdDate: "string",
        updatedDate: "string",
      },
    ];

    renderWithProviders(
      <ReleaseDrawer {...defaultProps} envList={mockEnvList} />
    );

    const copyButton = screen.getAllByRole("button")[0]; // assuming it's the first copy button
    fireEvent.click(copyButton);
  });

  it("renders nothing for empty envList", () => {
    renderWithProviders(<ReleaseDrawer {...defaultProps} envList={[]} />);
    expect(screen.queryByText("Production")).not.toBeInTheDocument();
    expect(screen.queryByText("Staging")).not.toBeInTheDocument();
  });

  it("renders nothing for undefined envList", () => {
    renderWithProviders(
      <ReleaseDrawer {...defaultProps} envList={undefined as any} />
    );
    expect(screen.queryByText("Production")).not.toBeInTheDocument();
    expect(screen.queryByText("Staging")).not.toBeInTheDocument();
  });

  it("calls clipboard.writeText and showAlert on copy", () => {
    const mockShowAlert = jest.fn();
    jest
      .spyOn(require("src/utils/alert"), "showAlert")
      .mockImplementation(mockShowAlert);

    const mockEnvList = [
      {
        value: "env1",
        label: "Production",
        key: "prod-key",
      },
    ];

    renderWithProviders(
      <ReleaseDrawer {...defaultProps} envList={mockEnvList} />
    );

    const copyButton = document.querySelector(".copyButton");
    expect(copyButton).toBeInTheDocument();
    fireEvent.click(copyButton!);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("prod-key");
    expect(mockShowAlert).toHaveBeenCalledWith(
      1,
      "Key has been copied successfully."
    );
  });

  //commented as this fetaure is disabled for now

  // it("allows entering deployment name", () => {
  //   renderWithProviders(<ReleaseDrawer {...defaultProps} />);
  //   const input = screen.getByPlaceholderText("Name") as HTMLInputElement;
  //   fireEvent.change(input, { target: { value: "Release v1" } });
  //   expect(input.value).toBe("Release v1");
  // });

  // it("submits form when Create button is clicked and form is valid", () => {
  //   const mockSubmit = jest.fn();

  //   mockUseReleaseDrawerHelper.mockReturnValueOnce({
  //     ...mockUseReleaseDrawerHelper(),
  //     handleSubmit: mockSubmit,
  //     newDeployment: false,
  //     // mock Formik with valid + dirty state
  //     formik: {
  //       values: { name: "TestDeployment" },
  //       errors: {},
  //       touched: {},
  //       handleChange: jest.fn(),
  //       handleBlur: jest.fn(),
  //       handleSubmit: mockSubmit,
  //       setFieldValue: jest.fn(),
  //       isValid: true,
  //       dirty: true,
  //     },
  //   });

  //   renderWithProviders(<ReleaseDrawer {...defaultProps} />);

  //   const createButton = screen.getByRole("button", { name: "Create" });
  //   fireEvent.click(createButton);

  //   // expect(mockSubmit).toHaveBeenCalled();
  // });

  // it("disables Create button if form is invalid or not dirty", () => {
  //   mockUseReleaseDrawerHelper.mockReturnValueOnce({
  //     ...mockUseReleaseDrawerHelper(),
  //     formik: { ...formikMock, isValid: false, dirty: false },
  //   });
  //   renderWithProviders(<ReleaseDrawer {...defaultProps} />);
  //   const createButton = screen.getByRole("button", { name: "Create" });
  //   expect(createButton).toBeDisabled();
  // });

  // it("shows Add New Deployment button when newDeployment is true", () => {
  //   mockUseReleaseDrawerHelper.mockReturnValueOnce({
  //     ...mockUseReleaseDrawerHelper(),
  //     newDeployment: true,
  //   });
  //   renderWithProviders(<ReleaseDrawer {...defaultProps} />);
  //   expect(screen.getByText("Add New Deployment")).toBeInTheDocument();
  // });

  // it("calls handleAddNewDeployment on Add New Deployment click", () => {
  //   const handleAddNewDeployment = jest.fn();
  //   mockUseReleaseDrawerHelper.mockReturnValueOnce({
  //     ...mockUseReleaseDrawerHelper(),
  //     newDeployment: true,
  //     handleAddNewDeployment,
  //   });
  //   renderWithProviders(<ReleaseDrawer {...defaultProps} />);
  //   fireEvent.click(screen.getByText("Add New Deployment"));
  //   expect(handleAddNewDeployment).toHaveBeenCalled();
  // });

  it("calls onClose when close drawer button is clicked", () => {
    const handleDrawerClose = jest.fn();
    mockUseReleaseDrawerHelper.mockReturnValueOnce({
      ...mockUseReleaseDrawerHelper(),
      handleDrawerClose,
    });
    renderWithProviders(<ReleaseDrawer {...defaultProps} />);
    const closeButton = screen.getByLabelText("Close Drawer");
    fireEvent.click(closeButton);
    expect(handleDrawerClose).toHaveBeenCalled();
  });
});
