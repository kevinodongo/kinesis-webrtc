import { VERSION } from "../src/index";

it("should export the version", () => {
  expect(VERSION).not.toBeFalsy();
});
