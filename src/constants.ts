export enum Event {
  'Compress.completed' = 'Compress.completed',
  'Compress.failed' = 'Compress.failed',
  'Compress.detail' = 'Compress.detail',
};

export enum SettingsKey {
  'settings.compression.task_config.concurrency' = 'settings.compression.task_config.concurrency',
  'settings.compression.task_config.output.mode' = 'settings.compression.task_config.output.mode',
  'settings.compression.task_config.output.mode.new_file' = 'settings.compression.task_config.output.mode.new_file',
  'settings.compression.task_config.output.mode.new_folder' = 'settings.compression.task_config.output.mode.new_folder',
  'settings.compression.task_config.output.mode.new_folder.path' = 'settings.compression.task_config.output.mode.new_folder',
  'settings.compression.task_config.output.mode.new_file.suffix' = 'settings.compression.task_config.output.mode.new_file',
  'settings.compression.task_config.metadata' = 'settings.compression.task_config.metadata',
  'settings.compression.task_config.metadata.copyright' = 'settings.compression.task_config.metadata.copyright',
  'settings.compression.task_config.metadata.creator' = 'settings.compression.task_config.metadata.creator',
  'settings.compression.task_config.metadata.location' = 'settings.compression.task_config.metadata.location',
};


export enum SettingsCompressionTaskConfigOutputMode {
  'new_file' = 'new_file',
  'overwrite' = 'overwrite',
  'new_folder' = 'new_folder',
};

export enum SettingsCompressionTaskConfigMetadata {
  'copyright' = 'copyright',
  'creator' = 'creator',
  'location' = 'location',
};
