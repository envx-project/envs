import { pathsToModuleNameMapper } from "ts-jest";
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
import type { JestConfigWithTsJest } from "ts-jest";

import fs from "fs";
import { stripComments } from "jsonc-parser";

const tsconfigFile = fs.readFileSync("./tsconfig.json");

const { compilerOptions } = JSON.parse(
  stripComments(tsconfigFile.toString())
) as {
  compilerOptions: {
    baseUrl: string;
    paths: Record<string, string[]>;
  };
};

const jestConfig: JestConfigWithTsJest = {
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl], // <-- This will be set to 'baseUrl' value
  moduleNameMapper: pathsToModuleNameMapper(
    compilerOptions.paths /*, { prefix: '<rootDir>/' } */
  ),
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  collectCoverageFrom: ["src/**/*.ts"],
};

export default jestConfig;