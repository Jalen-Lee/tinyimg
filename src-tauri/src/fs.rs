// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command(rename_all = "snake_case")]
pub fn parse_dir(path: &str, valid_exts: Vec<&str>) -> Vec<String> {
    let pattern = format!("{}/**/*", path);
    let files = glob::glob(&pattern).unwrap();
    files
        .filter_map(|file| {
            let file_path = file.unwrap();
            let ext = file_path.extension()?.to_str()?;
            if valid_exts.contains(&ext) {
                Some(file_path.to_str().unwrap().to_string())
            } else {
                None
            }
        })
        .collect::<Vec<_>>()
}
