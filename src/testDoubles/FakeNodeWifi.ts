import { ConnectionOpts, InitConfig } from 'node-wifi'

export default class FakeNodeWifi {
    public static callsToInit: InitConfig[] = []
    public static callsToConnect: ConnectionOpts[] = []

    public constructor() {}

    public init(options: InitConfig) {
        FakeNodeWifi.callsToInit.push(options)
    }

    public async connect(options: ConnectionOpts) {
        FakeNodeWifi.callsToConnect.push(options)
    }

    public static resetTestDouble() {
        FakeNodeWifi.callsToInit = []
        FakeNodeWifi.callsToConnect = []
    }
}
