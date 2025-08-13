import AbstractSpruceTest, {
    test,
    assert,
    generateId,
} from '@sprucelabs/test-utils'
import AutoWifiConnector, { WifiConnector } from '../modules/AutoWifiConnector'
import FakeNodeWifi from '../testDoubles/FakeNodeWifi'

export default class AutoWifiConnectorTest extends AbstractSpruceTest {
    private static instance: WifiConnector

    protected static async beforeEach() {
        await super.beforeEach()

        this.setFakeProcess()
        this.setFakeExec()
        this.setFakeNodeWifi()
        this.setNoWaitMs()

        this.instance = await this.AutoWifiConnector()
    }

    @test()
    protected static async createsInstance() {
        assert.isTruthy(this.instance, 'Should create an instance!')
    }

    @test()
    protected static async initializesWifiModule() {
        assert.isEqualDeep(
            FakeNodeWifi.callsToInit[0],
            { iface: null },
            'Need to initialize wifi module!'
        )
    }

    @test()
    protected static async callsConnectOnWifiModule() {
        assert.isEqualDeep(
            FakeNodeWifi.callsToConnect[0],
            { ssid: this.ssid, password: this.password },
            'Need to call connect on wifi module!'
        )
    }

    @test()
    protected static async callsDisconnectOnWifiModule() {
        await this.instance.disconnect()

        assert.isEqual(
            FakeNodeWifi.numCallsToDisconnect,
            1,
            'Need to call disconnect on wifi module!'
        )
    }

    @test()
    protected static async providesOptionToNotConnectOnCreate() {
        await this.createWithoutConnect()

        assert.isEqualDeep(
            FakeNodeWifi.callsToConnect.length,
            0,
            'Should not call connect on wifi module!'
        )
    }

    @test()
    protected static async exposesConnectMethod() {
        const instance = await this.createWithoutConnect()

        assert.isEqual(
            FakeNodeWifi.callsToConnect.length,
            0,
            'Should not call connect yet!'
        )

        await instance.connect(this.options)

        assert.isEqualDeep(
            FakeNodeWifi.callsToConnect[0],
            this.options,
            'Should call connect on wifi module!'
        )
    }

    @test()
    protected static async usesDifferentDisconnectStrategyForMacOS() {
        FakeNodeWifi.resetTestDouble()
        AutoWifiConnector.process = { platform: 'darwin' } as any

        const instance = await this.AutoWifiConnector()
        await instance.disconnect()

        assert.isEqual(
            FakeNodeWifi.numCallsToDisconnect,
            0,
            'Should not call connect!'
        )
    }

    private static setFakeProcess() {
        AutoWifiConnector.process = { platform: generateId() } as any
    }

    private static setFakeExec() {
        AutoWifiConnector.exec = () => Promise.resolve() as any
    }

    private static setFakeNodeWifi() {
        AutoWifiConnector.wifi = new FakeNodeWifi() as any
        FakeNodeWifi.resetTestDouble()
    }

    private static setNoWaitMs() {
        AutoWifiConnector.waitMs = 0
    }

    private static async createWithoutConnect() {
        FakeNodeWifi.resetTestDouble()

        return await AutoWifiConnector.Create({
            ...this.options,
            connectOnCreate: false,
        })
    }

    private static ssid = generateId()
    private static password = generateId()

    private static options = {
        ssid: this.ssid,
        password: this.password,
    }

    private static AutoWifiConnector() {
        return AutoWifiConnector.Create(this.options)
    }
}
