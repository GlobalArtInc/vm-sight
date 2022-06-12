export {VolumeDriverOpts, VolumesFormCreate}

interface VolumeDriverOpts {
    remote: string;
    local: string;
}

interface VolumesFormCreate {
    Name: string | null;
    Driver: string;
    Labels: {};
    DriverOpts: {};
}
