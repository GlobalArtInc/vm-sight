import App from "../../app";
import Controller from "../../interfaces/controller.interface";
import {Router} from "express";
import {IRequest, IResponse, INext} from "../../interfaces/express.interface";
import {dbQuery} from "../../utils/DB";
import authMiddleware from "../../middleware/auth.middleware";
import {getSetting} from "../../utils/Global";
import HttpException from "../../exceptions/HttpException";
import {appVersion} from "../../constants";

class SettingsController extends App implements Controller {
    public path = '/settings'
    public router = Router()

    constructor(...props) {
        super(props)
        this.initializeRoutes();
    }

    public async getSetting(name) {
        const response = await dbQuery(`SELECT * FROM settings WHERE key = '${name}'`)
        if (response['length'] > 0) {
            return response[0]
        } else {
            return false
        }
    }

    public async setSetting(name, value) {
        const setting = await this.getSetting(name)
        if (setting) {
            return await dbQuery(`UPDATE settings SET value = '${value}' WHERE key = '${name}'`)
        } else {
            return await dbQuery(`INSERT INTO settings VALUES('${name}', '${value}')`)
        }
    }

    private initializeRoutes() {
        this.router.get('/', authMiddleware)

        this.router.get('/public', async (req: IRequest, res: IResponse, next: INext) => {
            const settings = await dbQuery('SELECT * FROM settings')

            const OAuthLoginURI = `${getSetting(settings, 'AuthorizationURI', "")}?response_type=code&client_id=${getSetting(settings, 'ClientID', "")}&redirect_uri=${getSetting(settings, 'RedirectURI', "")}&scope=${getSetting(settings, 'Scopes', "")}`

            return res.send({
                Version: appVersion,
                AuthenticationMethod: getSetting(settings, 'AuthenticationMethod', 1),
                EnableEdgeComputeFeatures: getSetting(settings, 'EnableEdgeComputeFeatures', false),
                EnableTelemetry: getSetting(settings, 'EnableTelemetry', true),
                LogoURL: getSetting(settings, 'LogoURL', ""),
                OAuthLoginURI: OAuthLoginURI,
                OAuthLogoutURI: getSetting(settings, 'LogoutURI', ""),
            })
        })

        this.router.get('/', async (req: IRequest, res: IResponse) => {
            const settings = await dbQuery('SELECT * FROM settings')

            res.send({
                AllowBindMountsForRegularUsers: getSetting(settings, 'AllowBindMountsForRegularUsers', false),
                AllowContainerCapabilitiesForRegularUsers: getSetting(settings, 'AllowContainerCapabilitiesForRegularUsers', false),
                AllowDeviceMappingForRegularUsers: getSetting(settings, 'AllowDeviceMappingForRegularUsers', false),
                AllowPrivilegedModeForRegularUsers: getSetting(settings, 'AllowPrivilegedModeForRegularUsers', false),
                AllowStackManagementForRegularUsers: getSetting(settings, 'AllowStackManagementForRegularUsers', false),
                AllowVolumeBrowserForRegularUsers: getSetting(settings, 'AllowVolumeBrowserForRegularUsers', false),
                AuthenticationMethod: getSetting(settings, 'AuthenticationMethod', 1),
                BlackListedLabels: getSetting(settings, 'BlackListedLabels', []),
                DisplayDonationHeader: getSetting(settings, 'DisplayDonationHeader', false),
                DisplayExternalContributors: getSetting(settings, 'DisplayExternalContributors', false),
                EdgeAgentCheckinInterval: getSetting(settings, 'EdgeAgentCheckinInterval', 5),
                EnableEdgeComputeFeatures: getSetting(settings, 'EnableEdgeComputeFeatures', false),
                EnableHostManagementFeatures: getSetting(settings, 'EnableHostManagementFeatures', false),
                EnableTelemetry: getSetting(settings, 'EnableTelemetry', true),
                OAuthSettings: {
                    AccessTokenURI: getSetting(settings, 'AccessTokenURI', ""),
                    AuthorizationURI: getSetting(settings, 'AuthorizationURI', ""),
                    ClientID: getSetting(settings, 'ClientID', ""),
                    LogoutURI: getSetting(settings, 'LogoutURI', ""),
                    OAuthAutoCreateUsers: getSetting(settings, 'OAuthAutoCreateUsers', false),
                    RedirectURI: getSetting(settings, 'RedirectURI', ""),
                    ResourceURI: getSetting(settings, 'ResourceURI', ""),
                    SSO: getSetting(settings, 'SSO', false),
                    Scopes: getSetting(settings, 'Scopes', ""),
                    UserIdentifier: getSetting(settings, 'UserIdentifier', ""),
                },
                LogoURL: getSetting(settings, 'LogoURL', ""),
                SnapshotInterval: getSetting(settings, 'SnapshotInterval', "5m"),
                UserSessionTimeout: getSetting(settings, 'UserSessionTimeout', "8h")
            })
        })

        this.router.put('/auth', async (req: IRequest, res: IResponse, next: INext) => {
            const {AuthenticationMethod, UserSessionTimeout} = req.body
            const {
                AccessTokenURI, AuthorizationURI, ClientID,
                LogoutURI, OAuthAutoCreateUsers, RedirectURI, ResourceURI, SSO,
                Scopes, UserIdentifier, ClientSecret
            } = req.body.OAuthSettings

            if (UserSessionTimeout) {
                await this.setSetting('UserSessionTimeout', UserSessionTimeout)
            }

            if (AuthenticationMethod) {
                if (AuthenticationMethod === 1) {
                    const query = await dbQuery(`SELECT * FROM settings WHERE key = 'AuthenticationMethod'`)
                    if (query['length'] > 0) {
                        await dbQuery(`UPDATE settings SET value = 1 WHERE key = 'AuthenticationMethod'`)
                    } else {
                        await dbQuery(`INSERT INTO settings ('AuthenticationMethod', 1)`)
                    }
                    return res.send({status: 200, message: 'Authentication settings has been saved.'})
                } else if (AuthenticationMethod === 3) {
                    await this.setSetting('AuthenticationMethod', AuthenticationMethod)

                    if (typeof AccessTokenURI === 'string') {
                        await this.setSetting('AccessTokenURI', AccessTokenURI)
                    }
                    if (typeof AuthorizationURI === 'string') {
                        await this.setSetting('AuthorizationURI', AuthorizationURI)
                    }
                    if (typeof ClientID === 'string') {
                        await this.setSetting('ClientID', ClientID)
                    }
                    if (typeof LogoutURI === 'string') {
                        await this.setSetting('LogoutURI', LogoutURI)
                    }
                    if (typeof OAuthAutoCreateUsers === 'boolean') {
                        await this.setSetting('OAuthAutoCreateUsers', OAuthAutoCreateUsers)
                    }
                    if (typeof RedirectURI === 'string') {
                        await this.setSetting('RedirectURI', RedirectURI)
                    }
                    if (typeof ResourceURI === 'string') {
                        await this.setSetting('ResourceURI', ResourceURI)
                    }
                    if (typeof SSO === 'boolean') {
                        await this.setSetting('SSO', SSO)
                    }
                    if (typeof Scopes === 'string') {
                        await this.setSetting('Scopes', Scopes)
                    }
                    if (typeof UserIdentifier === 'string') {
                        await this.setSetting('UserIdentifier', UserIdentifier)
                    }
                    if (ClientSecret) {
                        await this.setSetting('ClientSecret', ClientSecret)
                    }
                    return res.send({status: 200, message: 'Authentication settings has been saved.'})
                } else {
                    return next(new HttpException(400, 'IncorrectAuthenticationMethod'))
                }
            } else {
                return next(new HttpException(400, 'NoAuthenticationMethod'))
            }
        })

        this.router.put('/', async (req: IRequest, res: IResponse) => {
            const data = req.body

            for (let key in data) {
                const item = data[key]
                if (typeof item === 'object') {
                    for (let subKey in item) {
                        const query = await dbQuery(`SELECT * FROM settings WHERE key = '${subKey}'`)
                        if (query['length'] > 0) {
                            await dbQuery(`UPDATE settings SET value = '${item[subKey]}' WHERE key = '${subKey}'`)
                        } else {
                            await dbQuery(`INSERT INTO settings VALUES ('${subKey}', '${item[subKey]}')`)
                        }
                    }
                } else {
                    const query = await dbQuery(`SELECT * FROM settings WHERE key = '${key}'`)
                    if (query['length'] > 0) {
                        await dbQuery(`UPDATE settings SET value = '${data[key]}' WHERE key = '${key}'`)
                    } else {
                        await dbQuery(`INSERT INTO settings VALUES ('${key}', '${data[key]}')`)
                    }
                }
            }
            return res.send({status: 200, message: "Settings has been updated."})

        })

    }
}

export default SettingsController