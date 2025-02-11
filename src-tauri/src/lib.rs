use std::{
    error::Error,
    mem,
    path::{Path, PathBuf},
    sync::{Arc, Mutex},
};
use tauri::{AppHandle, Emitter, Listener};
use tauri_plugin_fs::FsExt;
mod file_ext;
mod fs;

#[derive(Debug)]
pub struct Inspect {
    app: AppHandle,
    ready: bool,
    // Queued paths, now a queue to handle multiple paths
    queued: Vec<PathBuf>,
    // Errors passed to the client to be displayed (or logged)
    errors: Vec<String>,
}

impl Inspect {
    pub fn send(&mut self, path: PathBuf) -> tauri::Result<()> {
        if self.ready {
            // self.allow_file(&path);
            // self.app.emit("inspect", path)?;
        } else {
            self.queued.push(path);
        }

        Ok(())
    }

    pub fn ready(&mut self) -> tauri::Result<()> {
        self.ready = true;

        if !self.queued.is_empty() {
            let queued_clone = self.queued.clone();
            for path in &queued_clone {
                self.allow_file(path);
            }
            log::info!("inspect: {:?}", queued_clone);
            self.app.emit("inspect", queued_clone)?;
            self.queued.clear();

            // No longer using self.errors, so clear out the allocation
            for error in mem::take(&mut self.errors) {
                self.error_string(error);
            }
        }

        Ok(())
    }

    pub fn error_string(&mut self, error: String) {
        if self.ready {
            // TODO: if this errors, save to log file, ignore result for now
            let _ = self.app.emit("error", error);
        } else {
            self.errors.push(error);
        }
    }

    pub fn error<T: Error>(&mut self, err: T) {
        self.error_string(err.to_string());
    }

    fn allow_file(&mut self, path: &Path) {
        if let Err(err) = self.app.fs_scope().allow_file(path) {
            self.error(err);
        }
    }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(|app| {
            let inspect = Inspect {
                app: app.handle().clone(),
                ready: false,
                queued: Vec::new(),
                errors: Vec::new(),
            };
            // TODO: cli only
            // if let Ok(matches) = app.cli().matches() {
            //     if let Some(path) = matches.args.get("path") {
            //         if let Some(path) = path.value.as_str() {
            //             inspect.allow_file(Path::new(path));
            //         }
            //     }
            // }

            let inspect = Arc::new(Mutex::new(inspect));
            file_ext::load(inspect.clone());

            app.listen_any("ready", move |_| {
                let mut inspect = inspect.lock().unwrap();
                if let Err(err) = inspect.ready() {
                    inspect.error(err);
                }
            });
            let args: Vec<String> = std::env::args().collect();
            log::info!("Tauri launch args: {:?}", args);
            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_http::init())
        .plugin(
            tauri_plugin_log::Builder::new()
                .target(tauri_plugin_log::Target::new(
                    tauri_plugin_log::TargetKind::Stdout,
                ))
                .build(),
        )
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![fs::parse_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
