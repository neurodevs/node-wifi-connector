import { exec as _exec } from 'node:child_process'
import { promisify } from 'node:util'
import wifi, { ConnectionOpts } from 'node-wifi'

const exec = promisify(_exec)

export default class AutoWifiConnector implements WifiConnector {
    public static Class?: WifiConnectorConstructor
    public static wifi = wifi
    public static process = process
    public static exec = exec
    public static waitMs = 1000

    protected constructor() {
        this.initializeWifiModule()
    }

    public static async Create(options: WifiConnectorOptions) {
        const { connectOnCreate = true, ...opts } = options
        const instance = new (this.Class ?? this)()

        if (connectOnCreate) {
            await instance.connect(opts)
        }

        return instance
    }

    private initializeWifiModule() {
        this.wifi.init({ iface: null })
    }

    public async connect(options: ConnectionOpts) {
        await this.wifi.connect(options)
    }

    public async disconnect() {
        if (this.platformisMacOS) {
            await this.disconnectForMacOS()
            return
        }
        await this.wifi.disconnect()
    }

    private get platformisMacOS() {
        return this.process.platform == 'darwin'
    }

    private async disconnectForMacOS() {
        await this.turnOffWifiAdapter()
        await this.waitBeforeReconnect()
        await this.turnOnWifiAdapter()
    }

    private async turnOffWifiAdapter() {
        await this.exec('networksetup -setairportpower "Wi-Fi" off')
    }

    private waitBeforeReconnect() {
        return new Promise((resolve) => setTimeout(resolve, this.waitMs))
    }

    private async turnOnWifiAdapter() {
        await this.exec('networksetup -setairportpower "Wi-Fi" on')
    }

    private get wifi() {
        return AutoWifiConnector.wifi
    }

    private get process() {
        return AutoWifiConnector.process
    }

    private get exec() {
        return AutoWifiConnector.exec
    }

    private get waitMs() {
        return AutoWifiConnector.waitMs
    }
}

export interface WifiConnector {
    connect(options: WifiConnectorOptions): Promise<void>
    disconnect(): Promise<void>
}

export interface WifiConnectorOptions extends ConnectionOpts {
    connectOnCreate?: boolean
}

export type WifiConnectorConstructor = new () => WifiConnector
