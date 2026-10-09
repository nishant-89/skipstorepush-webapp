import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import PrivateRoute from "../privateRoute";

const mockStore = configureStore([]);

const renderAt = (path: string, role?: string, token = "tok") => {
  const store = mockStore({
    auth: { accessToken: token, user: { role } },
    profile: { data: role ? { role } : null },
  });
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <div>customer-home</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/all-apps"
            element={
              <PrivateRoute>
                <div>apps</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/overview"
            element={
              <PrivateRoute>
                <div>admin-home</div>
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <PrivateRoute>
                <div>customers</div>
              </PrivateRoute>
            }
          />
          <Route path="/login" element={<div>login</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("PrivateRoute role gates", () => {
  it("sends unauthenticated users to login", () => {
    renderAt("/dashboard", undefined, "");
    expect(screen.getByText("login")).toBeInTheDocument();
  });

  it("keeps customers on customer pages", () => {
    renderAt("/all-apps", "CUSTOMER");
    expect(screen.getByText("apps")).toBeInTheDocument();
  });

  it("redirects customers away from admin pages", () => {
    renderAt("/admin/customers", "CUSTOMER");
    expect(screen.getByText("customer-home")).toBeInTheDocument();
  });

  it("redirects admins away from customer product pages", () => {
    renderAt("/all-apps", "ADMIN");
    expect(screen.getByText("admin-home")).toBeInTheDocument();
  });

  it("keeps admins on admin pages", () => {
    renderAt("/admin/overview", "ADMIN");
    expect(screen.getByText("admin-home")).toBeInTheDocument();
  });
});
