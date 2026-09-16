/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter } from "react-router-dom";
import AddAppDrawer from "../addAppDrawer";
import { RootState } from "src/redux/rootReducers";

// Mocks
jest.mock("../helper", () => ({
  __esModule: true,
  useAllAppsHelper: jest.fn(),
}));

import { useAllAppsHelper } from "../helper";
const mockUseAllAppsHelper = useAllAppsHelper as jest.Mock;

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

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  editMode: false,
  appDetail: undefined,
};

const formikMock = {
  values: {
    name: "",
    platform: "",
  },
  errors: {},
  touched: {},
  handleChange: jest.fn(),
  handleBlur: jest.fn(),
  handleSubmit: jest.fn(),
  setFieldValue: jest.fn(),
  isValid: true,
  dirty: true,
};

beforeEach(() => {
  mockUseAllAppsHelper.mockReturnValue({
    uploadedImage: null,
    handleRemoveImage: jest.fn(),
    handleImageChange: jest.fn(),
    handleUploadClick: jest.fn(),
    handleDrawerClose: jest.fn(),
    fileInputRef: { current: null },
    formRef: { current: null },
    handleSubmit: jest.fn(),
    initial: { name: "", platform: "" },
    handleFile: jest.fn(),
    formik: formikMock,
  });
});

describe("AddAppDrawer", () => {
  it("renders Add New App title in create mode", () => {
    renderWithProviders(<AddAppDrawer {...defaultProps} />);
    expect(screen.getByText("Add New App")).toBeInTheDocument();
  });

  it("renders Edit App title in edit mode", () => {
    renderWithProviders(<AddAppDrawer {...defaultProps} editMode={true} />);
    expect(screen.getByText("Edit App")).toBeInTheDocument();
  });

  it("renders platform radio buttons in create mode", () => {
    renderWithProviders(<AddAppDrawer {...defaultProps} />);
    expect(screen.getByLabelText("Android")).toBeInTheDocument();
    expect(screen.getByLabelText("iOS")).toBeInTheDocument();
  });

  it("updates platform value when user selects Android", async () => {
    renderWithProviders(<AddAppDrawer {...defaultProps} />);
    const androidRadio = screen.getByLabelText("Android") as HTMLInputElement;

    // Before interaction
    expect(androidRadio.checked).toBe(false);

    // Fire the change
    fireEvent.click(androidRadio);

    // After interaction
    expect(androidRadio.checked).toBe(true);
  });

  it("updates name input value when changed", () => {
    renderWithProviders(<AddAppDrawer {...defaultProps} />);
    const input = screen.getByPlaceholderText(
      "Enter App Name"
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "TestApp" } });
    expect(input.value).toBe("TestApp");
  });

  //   it("calls form submit on Save button click", () => {
  //     renderWithProviders(<AddAppDrawer {...defaultProps} />);
  //     fireEvent.click(screen.getByRole("button", { name: /Save/i }));
  //     expect(mockUseAllAppsHelper().handleSubmit).toHaveBeenCalled();
  //   });

  it("disables Save button if form is invalid or not dirty", () => {
    mockUseAllAppsHelper.mockReturnValueOnce({
      ...mockUseAllAppsHelper(),
      formik: { ...formikMock, isValid: false, dirty: false },
    });
    renderWithProviders(<AddAppDrawer {...defaultProps} />);
    const saveButton = screen.getByRole("button", { name: /Save/i });
    expect(saveButton).toBeDisabled();
  });

  it("shows uploaded image and remove icon if image is uploaded", () => {
    mockUseAllAppsHelper.mockReturnValueOnce({
      ...mockUseAllAppsHelper(),
      uploadedImage: "mockImageUrl",
    });
    renderWithProviders(<AddAppDrawer {...defaultProps} />);
    expect(screen.getByAltText("Uploaded Icon")).toBeInTheDocument();
    expect(screen.getByLabelText("Remove Image")).toBeInTheDocument();
  });

  it("triggers image upload flow when upload button clicked", () => {
    renderWithProviders(<AddAppDrawer {...defaultProps} />);
    const uploadButton = screen.getByText(/Click To Upload/i);
    fireEvent.click(uploadButton);
    expect(mockUseAllAppsHelper().handleUploadClick).toHaveBeenCalled();
  });
  it("calls handleFile when image is dropped", () => {
    const mockHandleFile = jest.fn();
    mockUseAllAppsHelper.mockReturnValueOnce({
      ...mockUseAllAppsHelper(),
      handleFile: mockHandleFile,
    });

    renderWithProviders(<AddAppDrawer {...defaultProps} />);

    const dropZone = screen.getByText(/Click To Upload/i).closest("button")!;

    const file = new File(["dummy content"], "test.png", { type: "image/png" });
    const dataTransfer = {
      dataTransfer: {
        files: [file],
      },
      preventDefault: jest.fn(),
    };

    fireEvent.drop(dropZone, dataTransfer as unknown as DragEvent);

    expect(mockHandleFile).toHaveBeenCalledWith(file);
  });
  it("prevents default on drag over image upload area", () => {
    renderWithProviders(<AddAppDrawer {...defaultProps} />);
    const dropZoneButton = screen
      .getByText(/Click To Upload/i)
      .closest("button");

    const event = new Event("dragover", { bubbles: true });
    event.preventDefault = jest.fn(); // manually mock

    dropZoneButton!.dispatchEvent(event);

    expect(event.preventDefault).toHaveBeenCalled();
  });
});
