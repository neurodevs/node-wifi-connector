import AbstractSpruceTest, { test, assert } from '@sprucelabs/test-utils'
import generateId from '@neurodevs/generate-id'
import AutoWifiConnector, { WifiConnector } from '../../impl/AutoWifiConnector'
import FakeNodeWifi from '../../testDoubles/node-wifi/FakeNodeWifi'

export default class AutoWifiConnectorTest extends AbstractSpruceTest {
    private static instance: WifiConnector
    private static callsToExec: string[]
    private static returnExecResult: boolean

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
    protected static async doesNotConnectIfAlreadyConnectedOnMacOS() {
        this.setReturnExecResultTrue()

        await this.instance.connect(this.options)

        assert.isEqual(
            FakeNodeWifi.callsToConnect.length,
            1,
            'Should connect to wifi!'
        )

        await this.instance.connect(this.options)

        assert.isEqualDeep(
            FakeNodeWifi.callsToConnect.length,
            1,
            'Should not call connect again if already connected!'
        )
    }

    @test()
    protected static async doesNotConnectIfAlreadyConnectedOnOtherOS() {
        await this.instance.connect(this.options)

        assert.isEqual(
            FakeNodeWifi.callsToConnect.length,
            1,
            'Should connect to wifi!'
        )

        await this.instance.connect(this.options)

        assert.isEqualDeep(
            FakeNodeWifi.callsToConnect.length,
            1,
            'Should not call connect again if already connected!'
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
        await this.disconnectForMacOS()

        assert.isEqual(
            FakeNodeWifi.numCallsToDisconnect,
            0,
            'Should not call connect!'
        )
    }

    @test()
    protected static async turnsOffWifiAdapterOnMacOS() {
        this.setReturnExecResultTrue()

        await this.disconnectForMacOS()

        debugger
        assert.isEqual(
            this.callsToExec[1],
            'networksetup -setairportpower "Wi-Fi" off',
            'Should turn off wifi adapter on MacOS!'
        )
    }

    @test()
    protected static async waitsBeforeReconnectOnMacOS() {
        const t0 = Date.now()
        await this.disconnectForMacOS()
        const t1 = Date.now()

        assert.isTrue(
            t1 - t0 >= this.waitMs,
            'Should wait before reconnecting on MacOS!'
        )
    }

    @test()
    protected static async turnsOnWifiAdapterOnMacOS() {
        await this.disconnectForMacOS()

        assert.isEqual(
            this.callsToExec[2],
            'networksetup -setairportpower "Wi-Fi" on',
            'Should turn on wifi adapter on MacOS!'
        )
    }

    private static async disconnectForMacOS() {
        FakeNodeWifi.resetTestDouble()
        this.fakeProcessPlatform()

        const instance = await this.AutoWifiConnector()
        await instance.disconnect()
    }

    private static fakeProcessPlatform(platform = 'darwin') {
        AutoWifiConnector.process = { platform } as any
    }

    private static setFakeProcess() {
        AutoWifiConnector.process = { platform: generateId() } as any
    }

    private static setFakeExec() {
        this.callsToExec = []
        this.returnExecResult = false

        AutoWifiConnector.exec = ((cmd: string) => {
            this.callsToExec.push(cmd)
            return this.returnExecResult
                ? { stdout: this.ssid }
                : { stdout: '' }
        }) as any
    }

    private static setFakeNodeWifi() {
        AutoWifiConnector.wifi = new FakeNodeWifi() as any
        FakeNodeWifi.resetTestDouble()
    }

    private static setNoWaitMs() {
        AutoWifiConnector.waitMs = this.waitMs
    }

    private static setReturnExecResultTrue() {
        this.returnExecResult = true
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
    private static waitMs = 5

    private static options = {
        ssid: this.ssid,
        password: this.password,
    }

    private static AutoWifiConnector() {
        return AutoWifiConnector.Create(this.options)
    }
}
