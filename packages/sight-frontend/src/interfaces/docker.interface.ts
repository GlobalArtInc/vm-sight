export interface VolumeDriverOpts {
  remote: string;
  local: string;
}

export interface VolumesFormCreate {
  Name: string | null;
  Driver: string;
  Labels: {};
  DriverOpts: {};
}
