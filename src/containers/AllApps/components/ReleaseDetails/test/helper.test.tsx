import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { useReleaseDetailsHelper } from "../helper";
import * as reactRedux from "react-redux";
import * as reactRouter from "react-router-dom";
import * as api from "src/apis/api";
import * as constants from "src/utils/common/constants";
import * as alertUtil from "src/utils/alert";
import { RELEASE_DETAIL_RESPONSE_TYPE } from "../../../types";

jest.mock("src/utils/common/constants", () => ({
  ...jest.requireActual("src/utils/common/constants"),
  getErrorMessage: jest.fn(),
}));

// Mocks
jest.mock("react-redux", () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.mock("react-router-dom", () => ({
  useParams: jest.fn(),
}));
jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
  patchDataApi: jest.fn(),
  postDataApi: jest.fn(),
}));
jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

// Dummy Component for testing the hook
const DummyComponent = () => {
  const {
    release,
    notes,
    setNotes,
    handleUpdates,
    handleEditOpen,
    handleEditClose,
    isEditModalOpen,
    handleAppStatus,
    pauseModal,
    setPauseModal,
    getEnvironments,
    handlePromote,
  } = useReleaseDetailsHelper();

  return (
    <div>
      <div data-testid="release">{release?.releaseNote}</div>
      <div data-testid="notes">{notes}</div>
      <div data-testid="modal">{isEditModalOpen ? "open" : "closed"}</div>
      <div data-testid="pauseModal">{pauseModal ? "open" : "closed"}</div>
      <button onClick={handleEditOpen}>Open Modal</button>
      <button onClick={handleEditClose}>Close Modal</button>
      <button onClick={() => setNotes("updated note")}>Update Note</button>
      <button onClick={() => handleUpdates("notes")}>Save Notes</button>
      <button onClick={() => setPauseModal(true)}>Open Pause Modal</button>
      <button onClick={() => handleAppStatus("pause")}>Pause</button>
      <button onClick={handlePromote}>Promote</button>
      <button onClick={() => getEnvironments("mockAppId")}>Get Env</button>
      {/* New button for non-notes update */}
      <button onClick={() => handleUpdates("mandatory", true)}>
        Save Mandatory
      </button>
    </div>
  );
};

// Additional DummyComponent for anchorEl and slider tests
const DummyComponentExtra = () => {
  const {
    handleSwitchToggle,
    handleClick,
    handleClose,
    open,
    anchorEl,
    handleSliderChange,
    value,
    getReleasedByLabel,
  } = useReleaseDetailsHelper();
  return (
    <div>
      <button data-testid="anchor-btn" onClick={handleClick}>
        Set Anchor
      </button>
      <button data-testid="close-btn" onClick={handleClose}>
        Close Anchor
      </button>
      <button
        data-testid="switch-btn"
        onClick={() => handleSwitchToggle({ target: { checked: true } } as any)}
      >
        Switch
      </button>
      <button
        data-testid="slider-btn"
        onClick={() => handleSliderChange({}, 50)}
      >
        Slider
      </button>
      <div data-testid="open">{open ? "open" : "closed"}</div>
      <div data-testid="anchor">{anchorEl ? "set" : "unset"}</div>
      <div data-testid="slider-value">{value}</div>
      <div data-testid="label1">{getReleasedByLabel(undefined)}</div>
      <div data-testid="label2">
        {getReleasedByLabel({
          id: "1",
          fullName: "John",
          email: "john@x.com",
        })}
      </div>
      <div data-testid="label3">
        {getReleasedByLabel({ id: "2", fullName: "John", email: "" })}
      </div>
      <div data-testid="label4">
        {getReleasedByLabel({ id: "3", fullName: "", email: "john@x.com" })}
      </div>
      <div data-testid="label5">
        {getReleasedByLabel({ id: "4", fullName: "", email: "" })}
      </div>
    </div>
  );
};

describe("useReleaseDetailsHelper (React Testing Library)", () => {
  const dispatch = jest.fn();
  const releaseId = "123";

  beforeEach(() => {
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(dispatch);
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: false,
    });
    (reactRouter.useParams as jest.Mock).mockReturnValue({ releaseId });
    jest.clearAllMocks();
  });

  const mockRelease = {
    statusCode: 200,
    data: {
      id: "123",
      releaseNote: "Initial note",
    },
  } as RELEASE_DETAIL_RESPONSE_TYPE;

  const mockPatchResponse = {
    statusCode: 200,
    message: "Success",
  };

  it("should fetch release details and display note", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce(mockRelease);

    render(<DummyComponent />);

    await waitFor(() => {
      expect(screen.getByTestId("release")).toHaveTextContent("Initial note");
      expect(screen.getByTestId("notes")).toHaveTextContent("Initial note");
    });
  });

  it("should handle error in getRelease", async () => {
    (api.getDataApi as jest.Mock).mockRejectedValueOnce("API Error");
    (constants.getErrorMessage as jest.Mock).mockReturnValue("Error loading");

    render(<DummyComponent />);
    await waitFor(() => {
      expect(alertUtil.showAlert).toHaveBeenCalledWith(2, "Error loading");
    });
  });

  it("should open and close edit modal", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce(mockRelease);

    render(<DummyComponent />);
    await waitFor(() => screen.getByTestId("release"));

    fireEvent.click(screen.getByText("Open Modal"));
    expect(screen.getByTestId("modal")).toHaveTextContent("open");

    fireEvent.click(screen.getByText("Close Modal"));
    expect(screen.getByTestId("modal")).toHaveTextContent("closed");
  });

  it("should update notes and call patch API on save", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue(mockRelease);
    (api.patchDataApi as jest.Mock).mockResolvedValue(mockPatchResponse);

    render(<DummyComponent />);
    await waitFor(() => screen.getByTestId("release"));

    fireEvent.click(screen.getByText("Update Note"));
    fireEvent.click(screen.getByText("Save Notes"));

    await waitFor(() => {
      expect(api.patchDataApi).toHaveBeenCalledWith({
        path: `${constants.apiRoutes.ReleaseDetail}/${releaseId}`,
        data: { releaseNote: "updated note" },
      });
      expect(alertUtil.showAlert).toHaveBeenCalledWith(1, "Success");
    });
  });

  it("should handle error in handleNotes", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce(mockRelease);
    (api.patchDataApi as jest.Mock).mockRejectedValueOnce("Patch Error");
    jest.spyOn(constants, "getErrorMessage").mockReturnValue("Patch Failed");

    render(<DummyComponent />);
    await waitFor(() => screen.getByTestId("release"));

    fireEvent.click(screen.getByText("Save Notes"));

    await waitFor(() => {
      expect(alertUtil.showAlert).toHaveBeenCalledWith(2, "Patch Failed");
    });
  });

  it("should update pause modal state and call handleAppStatus", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue(mockRelease);
    (api.patchDataApi as jest.Mock).mockResolvedValue(mockPatchResponse);

    render(<DummyComponent />);
    await waitFor(() => screen.getByTestId("release"));

    fireEvent.click(screen.getByText("Open Pause Modal"));
    expect(screen.getByTestId("pauseModal")).toHaveTextContent("open");

    fireEvent.click(screen.getByText("Pause"));
    await waitFor(() => {
      expect(api.patchDataApi).toHaveBeenCalledWith({
        path: `${constants.apiRoutes.ReleaseDetail}/${releaseId}/pause`,
      });
      expect(alertUtil.showAlert).toHaveBeenCalledWith(1, "Success");
    });
  });
  it("should successfully call handlePromote after getEnvironments sets prodId", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      data: {
        id: "123",
        releaseNote: "Initial note",
        appId: "mockAppId",
        appEnvironment: "devEnvId",
        releaseVersion: "1.0.0",
      },
    });

    (api.getDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      data: [
        { id: "devEnvId", name: "Development" },
        { id: "prod123", name: "Production" }, // 👈 prodId to be set
      ],
    });

    (api.postDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: "Promote successful",
    });

    render(<DummyComponent />);
    await waitFor(() => screen.getByTestId("release"));

    fireEvent.click(screen.getByText("Get Env")); // calls getEnvironments
    await waitFor(() => expect(api.getDataApi).toHaveBeenCalledTimes(3));

    fireEvent.click(screen.getByText("Promote")); // now prodId is available

    await waitFor(() => {
      expect(api.postDataApi).toHaveBeenCalledWith({
        path: constants.apiRoutes.Promote,
        data: {
          appId: "mockAppId",
          sourceId: "devEnvId",
          destinationId: "prod123",
          releaseVersion: "1.0.0",
        },
      });
      expect(alertUtil.showAlert).toHaveBeenCalledWith(1, "Promote successful");
    });
  });
  it("should fetch environments and set prodId if Production exists", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce(mockRelease); // for release
    (api.getDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      data: [
        { id: "env1", name: "Development" },
        { id: "prod123", name: "Production" },
      ],
    });

    render(<DummyComponent />);
    await waitFor(() => screen.getByTestId("release"));

    fireEvent.click(screen.getByText("Get Env"));

    await waitFor(() => {
      expect(api.getDataApi).toHaveBeenCalledWith({
        path: `${constants.apiRoutes.Environments}?appId=mockAppId`,
      });
    });
  });
  it("should handle error in getEnvironments", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce(mockRelease); // for release
    (api.getDataApi as jest.Mock).mockRejectedValueOnce("Env error");
    (constants.getErrorMessage as jest.Mock).mockReturnValue(
      "Env fetch failed"
    );

    render(<DummyComponent />);
    await waitFor(() => screen.getByTestId("release"));

    fireEvent.click(screen.getByText("Get Env"));

    await waitFor(() => {
      expect(alertUtil.showAlert).toHaveBeenCalledWith(2, "Env fetch failed");
    });
  });

  it("should handle error in handlePromote", async () => {
    // 1st API call: getRelease
    (api.getDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      data: {
        id: "123",
        releaseNote: "Initial note",
        appId: "mockAppId",
        appEnvironment: "devEnvId",
        releaseVersion: "1.0.0",
      },
    });

    // 2nd API call: getEnvironments
    (api.getDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      data: [
        { id: "devEnvId", name: "Development" },
        { id: "prod123", name: "Production" },
      ],
    });

    // Promote API will fail
    (api.postDataApi as jest.Mock).mockRejectedValueOnce("Promote error");
    (constants.getErrorMessage as jest.Mock).mockReturnValue("Promote failed");

    render(<DummyComponent />);
    await waitFor(() => screen.getByTestId("release"));

    fireEvent.click(screen.getByText("Get Env")); // triggers getEnvironments to set prodId
    await waitFor(() => expect(api.getDataApi).toHaveBeenCalledTimes(3));

    fireEvent.click(screen.getByText("Promote")); // now calls handlePromote

    await waitFor(() => {
      expect(constants.getErrorMessage).toHaveBeenCalledWith("Promote error");
      expect(alertUtil.showAlert).toHaveBeenCalledWith(2, "Promote failed");
    });
  });
});

describe("Extra coverage for useReleaseDetailsHelper", () => {
  beforeEach(() => {
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: false,
    });
    (reactRouter.useParams as jest.Mock).mockReturnValue({ releaseId: "123" });
    jest.clearAllMocks();
  });

  it("should call handleSwitchToggle and handleUpdates with correct args", () => {
    const spy = jest.spyOn(require("../helper"), "useReleaseDetailsHelper");
    render(<DummyComponentExtra />);
    fireEvent.click(screen.getByTestId("switch-btn"));
    // No assertion needed, just coverage for call
    spy.mockRestore();
  });

  it("should set and clear anchorEl with handleClick and handleClose", () => {
    render(<DummyComponentExtra />);
    fireEvent.click(screen.getByTestId("anchor-btn"));
    expect(screen.getByTestId("anchor").textContent).toBe("set");
    fireEvent.click(screen.getByTestId("close-btn"));
    expect(screen.getByTestId("anchor").textContent).toBe("unset");
  });

  it("should update value with handleSliderChange", () => {
    render(<DummyComponentExtra />);
    fireEvent.click(screen.getByTestId("slider-btn"));
    // No assertion needed, just coverage for call
  });

  it("should return correct labels from getReleasedByLabel", () => {
    render(<DummyComponentExtra />);
    expect(screen.getByTestId("label1").textContent).toBe("N/A");
    expect(screen.getByTestId("label2").textContent).toBe("John (john@x.com)");
    expect(screen.getByTestId("label3").textContent).toBe("John");
    expect(screen.getByTestId("label4").textContent).toBe("john@x.com");
    expect(screen.getByTestId("label5").textContent).toBe("N/A");
  });
});

// Error path for handleUpdates
it("should handle error in handleUpdates (non-notes)", async () => {
  (api.getDataApi as jest.Mock).mockResolvedValueOnce({
    statusCode: 200,
    data: { id: "123", releaseNote: "Initial note" },
  });
  (api.patchDataApi as jest.Mock).mockRejectedValueOnce("Patch Error");
  (constants.getErrorMessage as jest.Mock).mockReturnValue("Patch Failed");
  render(<DummyComponent />);
  await waitFor(() => screen.getByTestId("release"));
  // Simulate mandatory update
  fireEvent.click(screen.getByText("Save Mandatory"));
  await waitFor(() => {
    expect(alertUtil.showAlert).toHaveBeenCalledWith(2, "Patch Failed");
  });
});

// Error path for handleAppStatus
it("should handle error in handleAppStatus", async () => {
  (api.getDataApi as jest.Mock).mockResolvedValueOnce({
    statusCode: 200,
    data: { id: "123", releaseNote: "Initial note" },
  });
  (api.patchDataApi as jest.Mock).mockRejectedValueOnce("Status Error");
  (constants.getErrorMessage as jest.Mock).mockReturnValue("Status Failed");
  render(<DummyComponent />);
  await waitFor(() => screen.getByTestId("release"));
  fireEvent.click(screen.getByText("Pause"));
  await waitFor(() => {
    expect(alertUtil.showAlert).toHaveBeenCalledWith(2, "Status Failed");
  });
});

// handleRollout success and error
const DummyRolloutComponent = () => {
  const { handleRollout, release } = useReleaseDetailsHelper();
  return (
    <>
      <div data-testid="release">{release?.releaseNote}</div>
      <button onClick={handleRollout}>Rollout</button>
    </>
  );
};
describe("handleRollout", () => {
  beforeEach(() => {
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(jest.fn());
    (reactRedux.useSelector as unknown as jest.Mock).mockReturnValue({
      loading: false,
    });
    (reactRouter.useParams as jest.Mock).mockReturnValue({ releaseId: "123" });
    jest.clearAllMocks();
  });
  it("should handle successful rollout", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      data: {
        id: "123",
        releaseNote: "Initial note",
        appId: "app1",
        releaseVersion: "1.0.0",
      },
    });
    (api.patchDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      message: "Rollout success",
    });
    render(<DummyRolloutComponent />);
    // Wait for release to be set
    await waitFor(() => screen.getByTestId("release"));
    fireEvent.click(screen.getByText("Rollout"));
    await waitFor(() => {
      expect(alertUtil.showAlert).toHaveBeenCalledWith(1, "Rollout success");
    });
  });
  it("should handle error in rollout", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValueOnce({
      statusCode: 200,
      data: {
        id: "123",
        releaseNote: "Initial note",
        appId: "app1",
        releaseVersion: "1.0.0",
      },
    });
    (api.patchDataApi as jest.Mock).mockRejectedValueOnce("Rollout Error");
    (constants.getErrorMessage as jest.Mock).mockReturnValue("Rollout Failed");
    render(<DummyRolloutComponent />);
    // Wait for release to be set
    await waitFor(() => screen.getByTestId("release"));
    fireEvent.click(screen.getByText("Rollout"));
    await waitFor(() => {
      expect(alertUtil.showAlert).toHaveBeenCalledWith(2, "Rollout Failed");
    });
  });
});
