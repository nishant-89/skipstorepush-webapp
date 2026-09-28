import { renderHook, act, waitFor } from "@testing-library/react";
import { useHelpHelper } from "../helper";
import * as api from "src/apis/api";
import { apiRoutes } from "src/utils/common/constants";

const mockDispatch = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => mockDispatch,
}));

jest.mock("src/apis/api", () => ({
  getDataApi: jest.fn(),
}));

jest.mock("src/utils/alert", () => ({
  showAlert: jest.fn(),
}));

const faqPayload = {
  groups: [
    {
      id: "releases-ota",
      title: "Releases / OTA",
      items: [
        {
          id: "publish-ota-release",
          question: "How?",
          answer: "Like this.",
        },
      ],
    },
  ],
  search: "",
  totalItems: 1,
  isEmpty: false,
  emptyMessage: null,
  stillStuck: {
    message: "Still stuck?",
    docsUrl: "https://example.com/docs",
    supportEmail: "support@example.com",
  },
};

describe("useHelpHelper", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("loads grouped FAQs and toggles an item", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: faqPayload,
    });

    const { result } = renderHook(() => useHelpHelper());

    await waitFor(() => {
      expect(result.current.groups).toHaveLength(1);
    });
    expect(api.getDataApi).toHaveBeenCalledWith({
      path: apiRoutes.Faqs,
      data: {},
    });
    expect(result.current.stillStuck?.supportEmail).toBe("support@example.com");

    act(() => {
      result.current.toggleFaq("publish-ota-release");
    });
    expect(result.current.openId).toBe("publish-ota-release");

    act(() => {
      result.current.toggleFaq("publish-ota-release");
    });
    expect(result.current.openId).toBe(null);
  });

  it("sends a search query to the FAQ API", async () => {
    (api.getDataApi as jest.Mock).mockResolvedValue({
      success: true,
      data: { ...faqPayload, search: "ota", isEmpty: true, groups: [] },
    });

    const { result } = renderHook(() => useHelpHelper());
    await waitFor(() => {
      expect(api.getDataApi).toHaveBeenCalled();
    });

    act(() => {
      result.current.onSearch("ota");
    });

    await waitFor(() => {
      expect(api.getDataApi).toHaveBeenCalledWith({
        path: apiRoutes.Faqs,
        data: { search: "ota" },
      });
    });
  });
});
