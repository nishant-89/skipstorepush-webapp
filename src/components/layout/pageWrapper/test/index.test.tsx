import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PageContainer from "../index";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "src/redux/store";

jest.mock("@mui/material", () => {
  const actual = jest.requireActual("@mui/material");
  return {
    ...actual,
    Modal: ({ open, children }: any) =>
      open ? <div data-testid="mui-modal">{children}</div> : null,
    Button: ({ children, ...props }: any) => (
      <button {...props}>{children}</button>
    ),
    // Always render children for Menu in test
    Menu: ({ children }: any) => <div data-testid="mui-menu">{children}</div>,
    MenuItem: ({ children, ...props }: any) => {
      // If children is a string, set aria-label for accessibility
      const label = typeof children === "string" ? children : undefined;
      return (
        <div role="menuitem" tabIndex={0} aria-label={label} {...props}>
          {children}
        </div>
      );
    },
  };
});

describe("PageContainer", () => {
  it("renders children correctly", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PageContainer>
            <div data-testid="child">Test Child</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );
    expect(screen.getByTestId("child")).toHaveTextContent("Test Child");
  });

  it("opens logout modal when handleLogoutOpen is called via Header", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PageContainer>
            <div>Test</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );
    // Since Menu is always rendered in the mock, we don't need to click to open it
    const menu = screen.getByTestId("mui-menu");
    const logoutMenuItem = within(menu)
      .getAllByRole("menuitem")
      .find((el) => el.textContent === "Logout");
    if (!logoutMenuItem) throw new Error("Logout menuitem not found in menu");
    await userEvent.click(logoutMenuItem);

    // Check for the modal's title
    expect(
      screen.getByText("Are You Sure You Want To Logout?")
    ).toBeInTheDocument();

    // Or, check for the modal's Logout button
    expect(
      screen.getByRole("button", { name: /^logout$/i })
    ).toBeInTheDocument();
  });

  it("closes logout modal when handleLogoutClose is called", async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <PageContainer>
            <div>Test</div>
          </PageContainer>
        </MemoryRouter>
      </Provider>
    );

    // Open the modal first
    const menu = screen.getByTestId("mui-menu");
    const logoutMenuItem = within(menu)
      .getAllByRole("menuitem")
      .find((el) => el.textContent === "Logout");
    if (!logoutMenuItem) throw new Error("Logout menuitem not found in menu");
    await userEvent.click(logoutMenuItem);

    // Verify modal is open
    expect(
      screen.getByText("Are You Sure You Want To Logout?")
    ).toBeInTheDocument();

    // Click the Cancel button to close the modal (this will call handleLogoutClose)
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);

    // Verify modal is closed by checking that the modal content is no longer in the document
    expect(
      screen.queryByText("Are You Sure You Want To Logout?")
    ).not.toBeInTheDocument();
  });
});
