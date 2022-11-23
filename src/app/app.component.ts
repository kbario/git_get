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
    await this.pull();
  };

  public add = async () => {
    this.openDialog()
  };

  private pull = async () => {
    this.isLoadingSubject.next(true);
    const results: Result[] = [];
    const settings: Settings[] = await this.readSettings();

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

    this.resultsSubject.next(results)
    this.isLoadingSubject.next(false)
  }

  public openDialog = async (): Promise<void> => {
    const settings: Settings[] = await this.readSettings();
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '250px',
      data: { settings: settings },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!this.deepEqual(settings, result)) {
        this.writeSettings(result);
        this.pull();
      }
    });
  }

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
    return await writeTextFile("gg_settings.json", JSON.stringify(setts), { dir: BaseDirectory.Resource });
  };

  private deepEqual = (setts: Settings[], res: Settings[]) => {
    // if the number of keys is different, they are different
    if (setts.length !== res.length) return false
    for (let i = 0; i < setts.length; i++) {
      if (setts[i].path !== res[i].path || setts[i].id !== res[i].id) {
        return false
      } else {
        for (let j = 0; j < setts[i].branches.length; j++ ) {
          if (setts[i].branches.includes(res[i].branches[j])||
          res[i].branches.includes(setts[i].branches[j])) {
            return false
          }
        }
      }
    }
    return true
  }

};

