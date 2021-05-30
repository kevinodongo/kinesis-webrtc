import { KinesisClient } from "../src/index";
import { KinesisConfig } from "../src/KinesisClient";

let testConfig: KinesisConfig;

beforeEach(() => {
  testConfig = {
    region: "us-east-2",
    accessKeyId: "AKIAPW62UKEQ4C4K2722",
    secretAccessKey: "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",
  };
});

it("it should not throw an error when valid config is provided", () => {
  new KinesisClient(testConfig);
});

it("it should throw and error when region is empty", () => {
  testConfig.region = "";
  expect(() => new KinesisClient(testConfig)).toThrow("Region cannot be empty");
});

it("it should throw and error when access key is empty", () => {
  testConfig.accessKeyId = "";
  expect(() => new KinesisClient(testConfig)).toThrow(
    "Access key id cannot be empty"
  );
});

it("it should throw and error when secret access key is empty", () => {
  testConfig.secretAccessKey = "";
  expect(() => new KinesisClient(testConfig)).toThrow(
    "Secret access key cannot be empty"
  );
});
