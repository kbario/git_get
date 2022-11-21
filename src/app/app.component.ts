import { BehaviorSubject, Observable } from "rxjs";

import { invoke } from '@tauri-apps/api';
import { BaseDirectory, resolveResource } from '@tauri-apps/api/path'
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs'

import { Component, OnInit } from '@angular/core';

import { Output } from "./interfaces/Output";
import { GitPull } from "./interfaces/GitPull";
import { Settings } from "./interfaces/Settings";
import { results_initialiser } from "./initialisers";
import { Result } from "./interfaces/Result";
import { MatDialog } from '@angular/material/dialog';
import { AddDialogComponent } from "./components/add-dialog/add-dialog.component";
import { getNameFromPath } from "./shared/functions/getNameFromPath";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Git Get';

  public repoName: string = "";
  public currentBranch: string = "";
  public resultsSubject: BehaviorSubject<Result[]>;
  public results$: Observable<null | Result[]>;
  public isLoadingSubject: BehaviorSubject<boolean>;
  public isLoading$: Observable<boolean>;


  constructor(public dialog: MatDialog) {
    this.resultsSubject = new BehaviorSubject([results_initialiser])
    this.results$ = this.resultsSubject.asObservable();
    this.isLoadingSubject = new BehaviorSubject(true)
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  async ngOnInit(): Promise<void> {
    await this.getCurrentBranch()
    await this.pull()
    this.isLoadingSubject.next(false)
    this.openDialog()
  }

  public repull = async () => {
    this.isLoadingSubject.next(true);
    await this.pull();
    this.isLoadingSubject.next(false)
  };

  public add = async () => {
    this.openDialog()
  };

  private pull = async () => {
    const results: Result[] = [];
    const settings: Settings[] = await this.readSettings();
    console.log(settings)

    for (let i = 0; i < settings.length; i++) {
      const repo: string = settings[i].path;
      const result: Result = { repo: getNameFromPath(settings[i].path), branches: [] };

      for (let j = 0; j < settings[i].branches.length; j++) {
        const branch: string = settings[i].branches[j];
        const pull: GitPull = await invoke("pull_repo_branch", { repo, branch })
        result.branches.push({
          branch: branch,
          checkout: pull.checkout,
          pull: pull.pull
        })

      }

      results.push(result)
    }

    console.log(results)
    this.resultsSubject.next(results)
  }

  public openDialog = async (): Promise<void> =>  {
    const settings: Settings[] = await this.readSettings();
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '250px',
      data: {settings: settings},
    });

    dialogRef.afterClosed().subscribe(result => {
      this.writeSettings(result)
      console.log('The dialog was closed');
    });
  }
  // private getRepoName = async () => {
  //   const output: Output = await invoke("get_repo_name", {
  //     repo: "/Users/kylebario/luaProjects/spear.nvim/"
  //   })
  //   if (output.status === 0) {
  //     this.repoName = this.getNameFromPath(output.stdout)
  //   }
  // }

  private getCurrentBranch = async () => {
    const output: Output = await invoke("get_current_branch", {
      repo: "/Users/kylebario/luaProjects/spear.nvim/"
    })
    if (output.status === 0) {
      this.currentBranch = output.stdout
    }
  }



  private readSettings = async () => {
    const resourcePath = await resolveResource('gg_settings.json')
    return JSON.parse(await readTextFile(resourcePath))

  };

  private writeSettings = async (setts: Settings) => {
    return await writeTextFile("gg_settings", JSON.stringify(setts), { dir: BaseDirectory.Resource });

  };
}




