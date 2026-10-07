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

  it("shows the default user icon when profileImage is null", () => {
    (usePublicProfileHelper as jest.Mock).mockReturnValue({
      profile: {
        id: 2,
        fullName: "Sam Collaborator",
        email: "sam@example.com",
        profileImage: null,
      },
      missing: false,
    });

    const { container } = render(
      <MemoryRouter>
        <PublicProfile />
      </MemoryRouter>
    );

    expect(container.querySelector(".profileImage.isPlaceholder")).toBeInTheDocument();
    expect(container.querySelector(".profileImage svg")).toHaveAttribute("width", "36");
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
