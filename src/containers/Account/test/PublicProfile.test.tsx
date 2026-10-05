import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PublicProfile from "../PublicProfile";
import { usePublicProfileHelper } from "../publicProfileHelper";

jest.mock("../publicProfileHelper", () => ({
  usePublicProfileHelper: jest.fn(),
}));

jest.mock("src/components/common/BreadCrumbs/BreadCrumbs", () => ({
  __esModule: true,
  default: ({ currentLabel }: { currentLabel?: string }) => (
    <div>{currentLabel}</div>
  ),
}));

jest.mock("src/components/common/NoData/NoData", () => ({
  __esModule: true,
  default: ({ title }: { title?: string }) => <div>{title}</div>,
}));

jest.mock("src/utils/common/constants/constants", () => ({
  UserPlaceholderIcon: "placeholder.png",
}));

describe("PublicProfile", () => {
  it("renders image, name, and email", () => {
    (usePublicProfileHelper as jest.Mock).mockReturnValue({
      profile: {
        id: 2,
        fullName: "Sam Collaborator",
        email: "sam@example.com",
        profileImage: "https://example.com/sam.png",
      },
      missing: false,
    });

    render(
      <MemoryRouter>
        <PublicProfile />
      </MemoryRouter>
    );

    expect(screen.getByRole("heading", { name: "Profile" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Sam Collaborator" })
    ).toBeInTheDocument();
    expect(screen.getByText("sam@example.com")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Sam Collaborator" })).toHaveAttribute(
      "src",
      "https://example.com/sam.png"
    );
  });

  it("shows not found when the profile is unavailable", () => {
    (usePublicProfileHelper as jest.Mock).mockReturnValue({
      profile: null,
      missing: true,
    });

    render(
      <MemoryRouter>
        <PublicProfile />
      </MemoryRouter>
    );

    expect(screen.getByText("Profile not found")).toBeInTheDocument();
  });
});
