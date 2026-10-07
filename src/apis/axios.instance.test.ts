import { AxiosError } from "axios";
import { isWebSessionUnauthorized } from "./axios.instance";

jest.mock("src/redux/store", () => ({
  __esModule: true,
  default: {
    getState: () => ({ auth: { accessToken: "token" } }),
  },
}));

describe("isWebSessionUnauthorized", () => {
  it("ignores CodePush CLI bearer 401 so a missing web API does not log out", () => {
    const error = {
      response: {
        status: 401,
        data: 'The session or access key being used is invalid, please run "skip-store-push login" again.',
      },
    } as AxiosError<string>;

    expect(isWebSessionUnauthorized(error)).toBe(false);
  });

  it("treats JWT session 401 as a web logout", () => {
    const error = {
      response: {
        status: 401,
        data: { message: "Token has expired" },
      },
    } as AxiosError<{ message: string }>;

    expect(isWebSessionUnauthorized(error)).toBe(true);
  });
});
