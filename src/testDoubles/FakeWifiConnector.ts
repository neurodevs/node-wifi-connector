import { ConnectionOpts } from 'node-wifi'
import { WifiConnector } from '../modules/AutoWifiConnector'

export default class FakeWifiConnector implements WifiConnector {
    public static numCallsToConstructor = 0
    public static callsToConnect: ConnectionOpts[] = []
    public static numCallsToDisconnect = 0

    public constructor() {
        FakeWifiConnector.numCallsToConstructor++
    }

    public async connect(options: ConnectionOpts) {
        FakeWifiConnector.callsToConnect.push(options)
    }

    public async disconnect() {
        FakeWifiConnector.numCallsToDisconnect++
    }

    public static resetTestDouble() {
        FakeWifiConnector.numCallsToConstructor = 0
        FakeWifiConnector.callsToConnect = []
        FakeWifiConnector.numCallsToDisconnect = 0
    }
}
