import { GitPull } from "./interfaces/GitPull";
import { Output } from "./interfaces/Output";
import { Result } from "./interfaces/Result";

export const output_initialiser: Output = {
  action: "",
  status: null,
  stdout: "",
  stderr: "",
};

export const git_pull_intialiser: GitPull = {
  checkout: output_initialiser,
  pull: output_initialiser,
}

export const branches_initialiser = {
  branch: "",
  checkout: output_initialiser,
  pull: output_initialiser
}

export const results_initialiser: Result = {
  repo: "",
  branches: [branches_initialiser]
}
