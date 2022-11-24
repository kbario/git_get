import { BehaviorSubject, Observable } from "rxjs";

import { invoke } from '@tauri-apps/api';
import { BaseDirectory, dataDir, resolve } from '@tauri-apps/api/path'
import { exists, readTextFile, writeTextFile } from '@tauri-apps/api/fs'

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

  private settings: Settings[] = [];

  constructor(public dialog: MatDialog) {
    this.resultsSubject = new BehaviorSubject([results_initialiser])
    this.results$ = this.resultsSubject.asObservable();
    this.isLoadingSubject = new BehaviorSubject(true)
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  async ngOnInit(): Promise<void> {
    await this.initSettings()
    await this.getCurrentBranch()
    await this.pull()
    this.isLoadingSubject.next(false)
  }

  public repull = async () => {
    await this.pull();
  };

  public add = async () => {
    this.openDialog()
  };

  private initSettings = async () => {
    const dataExists = await exists('gg_settings.json', { dir: BaseDirectory.Data });
    if (dataExists) {
      this.settings = await this.readSettings();
    } else {
      this.writeSettings([]);
      this.settings = [];
    }
  };

  private pull = async () => {
    this.isLoadingSubject.next(true);
    const results: Result[] = [];

    for (let i = 0; i < this.settings.length; i++) {
      const repo: string = this.settings[i].path;
      const result: Result = { repo: getNameFromPath(this.settings[i].path), branches: [] };

      for (let j = 0; j < this.settings[i].branches.length; j++) {
        const branch: string = this.settings[i].branches[j];
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
    const dialogRef = this.dialog.open(AddDialogComponent, {
      width: '250px',
      data: { settings: this.settings },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.writeSettings(result);
      this.pull();
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
    const dataDirPath = await dataDir();
    const path = await resolve(dataDirPath, 'gg_settings.json')
    return JSON.parse(await readTextFile(path))
  };

  private writeSettings = async (setts: Settings[]) => {
    this.settings = setts;
    return await writeTextFile("gg_settings.json", JSON.stringify(setts), { dir: BaseDirectory.Data });
  };

};

