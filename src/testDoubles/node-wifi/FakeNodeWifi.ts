import { ConnectionOpts, InitConfig } from 'node-wifi'

export default class FakeNodeWifi {
    public static callsToInit: InitConfig[] = []
    public static callsToConnect: ConnectionOpts[] = []
    public static numCallsToDisconnect = 0
    public static numCallsToGetCurrentConnections = 0
    private static currentConnections: ConnectionOpts[] = []

    public constructor() {}

    public init(options: InitConfig) {
        FakeNodeWifi.callsToInit.push(options)
    }

    public async connect(options: ConnectionOpts) {
        FakeNodeWifi.callsToConnect.push(options)
        const { ssid } = options

        const ssidIsNotConnected = !FakeNodeWifi.currentConnections.some(
            (conn) => conn.ssid === ssid
        )

        if (ssidIsNotConnected) {
            FakeNodeWifi.currentConnections.push(options)
        }
    }

    public async disconnect() {
        FakeNodeWifi.numCallsToDisconnect++
        FakeNodeWifi.currentConnections = []
    }

    public async getCurrentConnections() {
        FakeNodeWifi.numCallsToGetCurrentConnections++
        return FakeNodeWifi.currentConnections
    }

    public static resetTestDouble() {
        FakeNodeWifi.callsToInit = []
        FakeNodeWifi.callsToConnect = []
        FakeNodeWifi.numCallsToDisconnect = 0
        FakeNodeWifi.numCallsToGetCurrentConnections = 0
        FakeNodeWifi.currentConnections = []
    }
}
