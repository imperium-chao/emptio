import { useAuth } from "@src/providers/userProvider"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { ButtonPrimary } from "@components/form/Buttons"
import { useTranslate } from "@src/services/translate"
import { walletService } from "@src/core/walletManager"
import { LinkSection, SectionContainer } from "@components/general/section"
import AlertBox, { alertMessage } from "@components/general/AlertBox"
import MessageBox, { showMessage } from "@components/general/MessageBox"
import SplashScreen from "@components/general/SplashScreen"
import { userService } from "@src/core/userManager"
import { FormControl, FormControlSwitch } from "@components/form/FormControl"
import { HeaderScreen } from "@components/general/HeaderPage"
import { useState } from "react"
import theme from "@src/theme"

const WalletSttings = ({ navigation, route }: any) => {

    const { wallet, setWallet, user, setUser } = useAuth()
    const [loading, setLoading] = useState(false)
    const [walletName, setWalletName] = useState(wallet.name)
    const [defaultWallet, setDefaultWallet] = useState<boolean>(wallet.key == user.default_wallet && user.default_wallet != undefined)

    const hadleDeleteWallet = async () => {
        showMessage({
            message: "Deseja realmente deletar está carteira? Esta é uma ação irreverssível, todos os dados dessa carteira serão perdidos!", action: {
                label: useTranslate("commons.delete"),
                onPress: async () => {

                    await walletService.delete(wallet ?? {})

                    navigation.reset({ index: 0, routes: [{ name: "core-stack" }] })
                }
            }
        })
    }

    const handleSave = async () => {

        setLoading(true)

        wallet.name = walletName

        if (defaultWallet) {
            user.default_wallet = wallet.key
            user.bitcoin_address = wallet.address

            await userService.updateProfile({ user, setUser, upNostr: true })
        }

        await walletService.update(wallet)

        if (setWallet)
            setWallet(wallet)

        setLoading(false)

        alertMessage(useTranslate("message.wallet.saved"))
    }

    if (loading)
        return <SplashScreen />

    return (
        <View style={styles.container}>
            {/* Header */}
            <HeaderScreen
                title={useTranslate("wallet.title.settings")}
                onClose={() => navigation.navigate("wallet-stack")}
            />

            <ScrollView contentContainerStyle={[theme.styles.scroll_container, { justifyContent: "center" }]}>

                <FormControlSwitch label="Default Wallet" value={defaultWallet} onChangeValue={setDefaultWallet} />

                <FormControl label={useTranslate("labels.wallet.name")} value={walletName} onChangeText={setWalletName} />

                <SectionContainer style={{ maxWidth: "90%" }}>
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                </SectionContainer>

                <SectionContainer style={{ maxWidth: "90%" }}>
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                    <LinkSection icon="copy" label="copy address" onPress={() => { }} />
                </SectionContainer>

                <TouchableOpacity style={{ marginVertical: 20, padding: 15, flexDirection: "row" }} onPress={hadleDeleteWallet} >
                    {/* <Ionicons name="trash" color={theme.colors.red} size={theme.icons.mine} /> */}
                    <Text style={{ color: theme.colors.red, fontSize: 18, fontWeight: "400", marginHorizontal: 5 }}>{useTranslate("commons.delete")}</Text>
                </TouchableOpacity>

            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <ButtonPrimary label={useTranslate("commons.save")} onPress={handleSave} />
            </View>
            <MessageBox />
            <AlertBox />
        </View>
    )
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        textAlign: "center",
        color: theme.colors.white
    },
    container: {
        backgroundColor: theme.colors.black,
        height: "100%"
    },
    footer: { width: "100%", position: "absolute", bottom: 10, alignItems: "center" }
})

export default WalletSttings