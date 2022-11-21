#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use std::process::Command;

#[derive(Debug, thiserror::Error)]
enum CustomError {
    #[error(transparent)]
    Io(#[from] std::io::Error),
}

// we must manually implement serde::Serialize
impl serde::Serialize for CustomError {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::ser::Serializer,
    {
        serializer.serialize_str(self.to_string().as_ref())
    }
}

#[derive(Serialize, Deserialize)]
struct CustomOutput {
    action: String,
    status: Option<i32>,
    stdout: String,
    stderr: String,
}

#[derive(Serialize, Deserialize)]
struct GitPull {
    checkout: CustomOutput,
    pull: CustomOutput,
}

#[derive(Serialize, Deserialize)]
struct ReposInfo {
    location: String,
    branches: Vec<String>,
}

#[derive(Serialize, Deserialize)]
struct GitPullInfo {
    repos: ReposInfo,
}

#[tauri::command]
fn get_repo_name(repo: &str) -> Result<CustomOutput, CustomError> {
    let current_branch = Command::new("git")
        .current_dir(repo)
        .args(["rev-parse", "--show-toplevel"])
        .output()
        .unwrap();
    let current_branch = CustomOutput {
        action: "get_repo_name".to_string(),
        status: current_branch.status.code(),
        stdout: String::from_utf8_lossy(&current_branch.stdout).to_string(),
        stderr: String::from_utf8_lossy(&current_branch.stderr).to_string(),
    };

    Ok(current_branch)
}

#[tauri::command]
fn get_current_branch(repo: &str) -> Result<CustomOutput, CustomError> {
    let current_branch = Command::new("git")
        .current_dir(repo)
        .args(["rev-parse", "--abbrev-ref", "HEAD"])
        .output()
        .unwrap();
    let current_branch = CustomOutput {
        action: "get_current_branch".to_string(),
        status: current_branch.status.code(),
        stdout: String::from_utf8_lossy(&current_branch.stdout).to_string(),
        stderr: String::from_utf8_lossy(&current_branch.stderr).to_string(),
    };

    Ok(current_branch)
}

#[tauri::command]
fn pull_repo_branch(repo: &str, branch: &str) -> Result<GitPull, CustomError> {
    let checkout = Command::new("git")
        .current_dir(repo)
        .args(["checkout", branch])
        .output()
        .unwrap();
    let checkout = CustomOutput {
        action: "checkout".to_string(),
        status: checkout.status.code(),
        stdout: String::from_utf8_lossy(&checkout.stdout).to_string(),
        stderr: String::from_utf8_lossy(&checkout.stderr).to_string(),
    };
    let pull = Command::new("git")
        .current_dir(repo)
        .args(["pull"])
        .output()
        .unwrap();
    let pull = CustomOutput {
        action: "pull".to_string(),
        status: pull.status.code(),
        stdout: String::from_utf8_lossy(&pull.stdout).to_string(),
        stderr: String::from_utf8_lossy(&pull.stderr).to_string(),
    };
    return Ok(GitPull { checkout, pull });
}

// #[tauri::command]
// fn pull(handle: tauri::AppHandle) -> Option<&'static serde_json::Value> {
//     let resource_path = handle
//         .path_resolver()
//         .resolve_resource("gg_settings.json")
//         .expect("failed to resolve resource");
//
//     let file = std::fs::File::open(&resource_path).unwrap();
//     let settings: serde_json::Value = serde_json::from_reader(file).unwrap();
//
//     
//
//     return settings.get(0).
// }

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            // pull,
            pull_repo_branch,
            get_current_branch,
            get_repo_name
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
