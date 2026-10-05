import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Account from "../Account";
import { useAccountHelper } from "../helper";

jest.mock("../helper", () => ({
  PROFILE_IMAGE_ACCEPT: ".png",
  useAccountHelper: jest.fn(),
}));

jest.mock("src/components/common/BreadCrumbs/BreadCrumbs", () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div>{title}</div>,
}));

jest.mock("src/components/common/Button/Button", () => ({
  __esModule: true,
  default: ({
    label,
    onClick,
  }: {
    label: string;
    onClick?: () => void;
  }) => <button onClick={onClick}>{label}</button>,
}));

jest.mock("src/components/common/Modal/logoutModal", () => ({
  __esModule: true,
  default: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div>Done for today?</div> : null,
}));

jest.mock("../changePasswordModal", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("src/components/common/Modal/accessKeyModal", () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock("src/utils/common/constants/constants", () => ({
  UserPlaceholderIcon: "placeholder.png",
  GithubIcon: "github.png",
}));

describe("Account", () => {
  beforeEach(() => {
    (useAccountHelper as jest.Mock).mockReturnValue({
      data: { fullName: "Ada", email: "ada@example.com", authType: "BASIC" },
      loading: false,
      accessKey: "",
      isGithubAuth: false,
      githubUsername: "",
      githubProfileUrl: "",
      isPasswordModalOpen: false,
      isAccessKeyModalOpen: false,
      fileInputRef: { current: null },
      openAccessKeyModal: jest.fn(),
      closeAccessKeyModal: jest.fn(),
      openPasswordModal: jest.fn(),
      closePasswordModal: jest.fn(),
      openProfileImagePicker: jest.fn(),
      handleProfileImageChange: jest.fn(),
    });
  });

  it("renders the two-column profile layout", () => {
    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );
    expect(
      screen.getByRole("heading", { name: "My Profile" })
    ).toBeInTheDocument();
    expect(screen.getByText("ada@example.com")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Profile" })).toHaveAttribute(
      "aria-current",
      "page"
    );
    expect(
      screen.getAllByRole("button", { name: "Change password" }).length
    ).toBeGreaterThan(0);
  });

  it("opens the logout modal from the profile page", () => {
    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));
    expect(screen.getByText("Done for today?")).toBeInTheDocument();
  });

  it("shows display name and GitHub username separately", () => {
    (useAccountHelper as jest.Mock).mockReturnValue({
      data: {
        fullName: "The Octocat",
        username: "octocat",
        email: "octocat@github.com",
        authType: "GITHUB",
      },
      loading: false,
      accessKey: "key",
      isGithubAuth: true,
      githubUsername: "octocat",
      githubProfileUrl: "https://github.com/octocat",
      isPasswordModalOpen: false,
      isAccessKeyModalOpen: false,
      fileInputRef: { current: null },
      openAccessKeyModal: jest.fn(),
      closeAccessKeyModal: jest.fn(),
      openPasswordModal: jest.fn(),
      closePasswordModal: jest.fn(),
      openProfileImagePicker: jest.fn(),
      handleProfileImageChange: jest.fn(),
    });
    render(
      <MemoryRouter>
        <Account />
      </MemoryRouter>
    );
    expect(screen.getByRole("heading", { name: "The Octocat" })).toBeInTheDocument();
    expect(screen.getByText("@octocat")).toBeInTheDocument();
    expect(screen.getByText("GitHub username")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "GitHub" })).toBeInTheDocument();
  });
});
