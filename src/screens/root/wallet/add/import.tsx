import { HeaderScreen } from "@components/general/HeaderScreen"
import { StyleSheet, View, Text } from "react-native"
import { useTranslate } from "@/src/services/translate"
import { FormControl } from "@components/form/FormControl"
import { ButtonPrimary } from "@components/form/Buttons"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import { useState } from "react"
import theme from "@src/theme"
import SplashScreen from "@components/general/SplashScreen"
import { walletService } from "@/src/core/walletManager"

const ImportWalletScreen = ({ navigation }: any) => {

    const [loading, setLoading] = useState(false)
    const [walletName, setWalletName] = useState<string>("")
    const [seedPhrase, setSeedPhrase] = useState<string>("")
    const [passPhrase, setPassPhrase] = useState<string>()

    const handleImport = async () => {

        var words = seedPhrase?.split(" ")

        if (!walletName)
            return alertMessage(useTranslate("message.wallet.nameempty"))

        if (words && words?.length < 12)
            return alertMessage(`${useTranslate("message.wallet.invalidseed")} ${words.length}.`)

        if (words && words?.length < 24 && words?.length > 12)
            return alertMessage(`${useTranslate("message.wallet.invalidseed")} ${words.length}.`)

        setLoading(true)

        const wallet = await walletService.import({ name: walletName, seedphrase: seedPhrase, passphrase: passPhrase })

        setLoading(false)

        if (wallet.key)
            navigation.navigate("wallet-stack")
    }

    if (loading)
        return <SplashScreen />

    return (
        <>
            {/* Header */}
            <HeaderScreen 
                title={useTranslate("screen.title.importwallet")}
                onClose={() => navigation.navigate("add-wallet-stack")}
            />

            {/* Body */}
            <Text style={styles.title}>{useTranslate("wallet.title.import")}</Text>

            <FormControl label={useTranslate("labels.wallet.name")} value={walletName} onChangeText={setWalletName} />

            <FormControl label="Seed Phrase" value={seedPhrase} onChangeText={setSeedPhrase} isTextArea />

            <FormControl label="PassPhrase" value={passPhrase} onChangeText={setPassPhrase} type="password" />

            {/* Footer */}
            <View style={styles.buttonArea}>
                <ButtonPrimary label={useTranslate("commons.import")} onPress={() => handleImport()} />
            </View>

            <AlertBox />
        </>
    )
}

const styles = StyleSheet.create({
    title: { fontSize: 30, maxWidth: "90%", fontWeight: "bold", textAlign: "center", color: theme.colors.white, marginVertical: 20 },
    buttonArea: { width: '100%', position: 'absolute', justifyContent: 'center', marginVertical: 10, flexDirection: "row", bottom: 10 }
})

export default ImportWalletScreen