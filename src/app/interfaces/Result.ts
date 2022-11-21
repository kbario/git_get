import { GitPull } from "./GitPull"

export interface Result {
  repo: string,
  branches: {
    branch: string,
    checkout: GitPull["checkout"],
    pull: GitPull["pull"],
  }[]
}
