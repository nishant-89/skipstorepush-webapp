import { render, screen, act } from "@testing-library/react";
import NetworkWrapper from "./index";

// Mock NoInternetFound to simplify output
jest.mock("../NoInternetFound", () => () => (
  <div data-testid="no-internet">No Internet</div>
));

jest.mock("src/utils/common/constants", () => ({
  ...jest.requireActual("src/utils/common/constants"),
  noInternet: "/mock-no-internet.svg",
}));

const CHILD_TEXT = "Network Content";

// Helper to mock navigator.onLine and connection
function defineNavigator(
  onLine: boolean = true,
  connection?: Partial<{
    downlink: number;
    addEventListener: jest.Mock;
    removeEventListener: jest.Mock;
  }>
) {
  Object.defineProperty(window.navigator, "onLine", {
    configurable: true,
    get: () => onLine,
  });
  if (connection) {
    Object.defineProperty(window.navigator, "connection", {
      configurable: true,
      value: connection,
    });
  } else {
    delete (window.navigator as any).connection;
  }
}

describe("NetworkWrapper", () => {
  let originalFetch: typeof window.fetch;
  let originalFileReader: typeof FileReader;

  beforeEach(() => {
    jest.resetAllMocks();
    localStorage.clear();
    jest.spyOn(Storage.prototype, "setItem");
    originalFetch = window.fetch;
    originalFileReader = window.FileReader;

    // Set up default fetch mock to prevent errors in other tests
    window.fetch = jest.fn().mockRejectedValue(new Error("Fetch not mocked"));

    defineNavigator(true);
  });

  afterEach(() => {
    window.fetch = originalFetch;
    window.FileReader = originalFileReader;
  });

  it("renders children when online", () => {
    render(
      <NetworkWrapper>
        <div>{CHILD_TEXT}</div>
      </NetworkWrapper>
    );
    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument();
    expect(screen.queryByTestId("no-internet")).not.toBeInTheDocument();
  });

  it("renders NoInternetFound when offline", () => {
    defineNavigator(false);
    render(
      <NetworkWrapper>
        <div>{CHILD_TEXT}</div>
      </NetworkWrapper>
    );
    expect(screen.getByTestId("no-internet")).toBeInTheDocument();
    expect(screen.queryByText(CHILD_TEXT)).not.toBeInTheDocument();
  });

  it("reacts to online/offline window events", () => {
    render(
      <NetworkWrapper>
        <div>{CHILD_TEXT}</div>
      </NetworkWrapper>
    );
    // Simulate offline
    act(() => {
      defineNavigator(false);
      window.dispatchEvent(new Event("offline"));
    });
    expect(screen.getByTestId("no-internet")).toBeInTheDocument();
    // Simulate online
    act(() => {
      defineNavigator(true);
      window.dispatchEvent(new Event("online"));
    });
    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument();
  });

  it("uses navigator.connection.downlink if available", () => {
    const mockConnection = {
      downlink: 0,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
    defineNavigator(true, mockConnection);
    render(
      <NetworkWrapper>
        <div>{CHILD_TEXT}</div>
      </NetworkWrapper>
    );
    // Should show NoInternetFound because downlink is 0
    expect(screen.getByTestId("no-internet")).toBeInTheDocument();
  });

  it("subscribes and unsubscribes to connection change events", () => {
    const addListener = jest.fn();
    const removeListener = jest.fn();
    const mockConnection = {
      downlink: 1,
      addEventListener: addListener,
      removeEventListener: removeListener,
    };
    defineNavigator(true, mockConnection);
    const { unmount } = render(
      <NetworkWrapper>
        <div>{CHILD_TEXT}</div>
      </NetworkWrapper>
    );
    expect(addListener).toHaveBeenCalledWith("change", expect.any(Function));
    unmount();
    expect(removeListener).toHaveBeenCalledWith("change", expect.any(Function));
  });

  it("caches image successfully and stores in localStorage", async () => {
    const mockBlob = new Blob(["mock image data"], { type: "image/svg+xml" });
    const mockDataUrl = "data:image/svg+xml;base64,mockImageData";

    // Mock fetch to return successful response
    window.fetch = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    } as Response);

    // Mock FileReader with proper simulation
    const mockFileReader = {
      readAsDataURL: jest.fn(() => {
        // Simulate async operation
        mockFileReader.result = mockDataUrl;
        setTimeout(() => {
          if (mockFileReader.onloadend) {
            mockFileReader.onloadend();
          }
        }, 0);
      }),
      onloadend: null as (() => void) | null,
      result: null as string | ArrayBuffer | null,
    };

    window.FileReader = jest.fn(() => mockFileReader) as any;

    render(
      <NetworkWrapper>
        <div>{CHILD_TEXT}</div>
      </NetworkWrapper>
    );

    // Wait for async operations to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      "noInternetImage",
      mockDataUrl
    );
  });

  it("handles FileReader result that is not a string", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const mockBlob = new Blob(["mock image data"], { type: "image/svg+xml" });

    // Mock fetch to return successful response
    window.fetch = jest.fn().mockResolvedValue({
      blob: () => Promise.resolve(mockBlob),
    } as Response);

    // Mock FileReader with non-string result
    const mockFileReader = {
      readAsDataURL: jest.fn(() => {
        // Simulate async operation with non-string result
        mockFileReader.result = new ArrayBuffer(8); // Non-string result
        setTimeout(() => {
          if (mockFileReader.onloadend) {
            mockFileReader.onloadend();
          }
        }, 0);
      }),
      onloadend: null as (() => void) | null,
      result: null as string | ArrayBuffer | null,
    };

    window.FileReader = jest.fn(() => mockFileReader) as any;

    render(
      <NetworkWrapper>
        <div>{CHILD_TEXT}</div>
      </NetworkWrapper>
    );

    // Wait for async operations to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 10));
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to convert image to a string"
    );
    expect(localStorage.setItem).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it("handles fetch error when caching image", async () => {
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    const fetchError = new Error("Network error");

    // Mock fetch to reject
    window.fetch = jest.fn().mockRejectedValue(fetchError);

    render(
      <NetworkWrapper>
        <div>{CHILD_TEXT}</div>
      </NetworkWrapper>
    );

    // Wait for the async operation to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 0));
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error fetching image:",
      fetchError
    );

    consoleErrorSpy.mockRestore();
  });
});
