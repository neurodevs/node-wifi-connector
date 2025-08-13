import wifi, { ConnectionOpts } from 'node-wifi'

export default class AutoWifiConnector implements WifiConnector {
    public static Class?: WifiConnectorConstructor
    public static wifi = wifi

    protected constructor() {
        this.initializeWifiModule()
    }

    public static async Create(options: WifiConnectorOptions) {
        const { connectOnCreate = true, ...opts } = options
        const instance = new (this.Class ?? this)()

        if (connectOnCreate) {
            await this.wifi.connect(opts)
        }

        return instance
    }

    private initializeWifiModule() {
        this.wifi.init({ iface: null })
    }

    public async disconnect() {
        await this.wifi.disconnect()
    }

    private get wifi() {
        return AutoWifiConnector.wifi
    }
}

export interface WifiConnector {
    disconnect(): Promise<void>
}

export interface WifiConnectorOptions extends ConnectionOpts {
    connectOnCreate?: boolean
}

export type WifiConnectorConstructor = new () => WifiConnector
