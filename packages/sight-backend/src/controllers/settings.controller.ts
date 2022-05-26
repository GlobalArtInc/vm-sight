import SettingsService from '@services/settings.service';

class SettingsController {
  public settingsService = new SettingsService();

  public main = async (req, res) => {
    return res.status(200).json(await this.settingsService.getSettings());
  };

  public public = async (req, res) => {
    return res.send(await this.settingsService.getPublic());
  };
}

export default SettingsController;
