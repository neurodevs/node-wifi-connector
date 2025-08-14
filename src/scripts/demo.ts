import AutoWifiConnector from '../modules/AutoWifiConnector'

async function main() {
    const wifi = await AutoWifiConnector.Create({
        ssid: 'RoArm-M2',
        password: process.env.ROARM_M2_WIFI_PASSWORD || '',
    })

    await new Promise((resolve) => setTimeout(resolve, 5000))

    await wifi.disconnect()
}

main().catch((error) => {
    console.error('Error connecting to WiFi:', error)
    process.exit(1)
})
