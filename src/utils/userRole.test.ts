import {
  USER_ROLE,
  homePathForRole,
  isAdminPath,
  isAdminRole,
  isCustomerOnlyPath,
} from "./userRole";

describe("userRole", () => {
  it("treats only ADMIN as an admin role", () => {
    expect(isAdminRole(USER_ROLE.ADMIN)).toBe(true);
    expect(isAdminRole(USER_ROLE.CUSTOMER)).toBe(false);
    expect(isAdminRole(undefined)).toBe(false);
  });

  it("sends admins to overview and customers to dashboard", () => {
    expect(homePathForRole(USER_ROLE.ADMIN)).toBe("/admin/overview");
    expect(homePathForRole(USER_ROLE.CUSTOMER)).toBe("/dashboard");
    expect(homePathForRole()).toBe("/dashboard");
  });

  it("detects admin paths", () => {
    expect(isAdminPath("/admin")).toBe(true);
    expect(isAdminPath("/admin/overview")).toBe(true);
    expect(isAdminPath("/dashboard")).toBe(false);
  });

  it("detects customer-only product paths", () => {
    expect(isCustomerOnlyPath("/dashboard")).toBe(true);
    expect(isCustomerOnlyPath("/all-apps/details/1")).toBe(true);
    expect(isCustomerOnlyPath("/my-activities")).toBe(true);
    expect(isCustomerOnlyPath("/invitations/abc")).toBe(true);
    expect(isCustomerOnlyPath("/settings")).toBe(false);
    expect(isCustomerOnlyPath("/admin/overview")).toBe(false);
  });
});
