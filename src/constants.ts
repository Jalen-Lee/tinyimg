export const SETTINGS_FILE_NAME = 'settings.json'
export const DEFAULT_SETTINGS_FILE_NAME = 'settings.default.json'

export enum SettingsKey {
  language = 'language',
  system_notification = 'system_notification',
  compression_tinypng_api_keys = 'compression_tinypng_api_keys',
  compression_tasks_concurrency = 'compression_tasks_concurrency',
  compression_tasks_output_mode = 'compression_tasks_output_mode',
  compression_tasks_output_mode_save_as_file_suffix = 'compression_tasks_output_mode_save_as_file_suffix',
  compression_tasks_output_mode_save_to_folder = 'compression_tasks_output_mode_save_to_folder',
  compression_quick_save = 'compression_quick_save',
  compression_tasks_save_compress_rate_limit = 'compression_tasks_save_compress_rate_limit',
  compression_tasks_save_compress_rate_limit_threshold = 'compression_tasks_save_compress_rate_limit_threshold',
  compression_retain_metadata = 'compression_retain_metadata',
};


export enum SettingsCompressionTaskConfigOutputMode {
  'save_as_new_file' = 'save_as_new_file',
  'overwrite' = 'overwrite',
  'save_to_new_folder' = 'save_to_new_folder',
};

export enum SettingsCompressionTaskConfigMetadata {
  'copyright' = 'copyright',
  'creator' = 'creator',
  'location' = 'location',
};
