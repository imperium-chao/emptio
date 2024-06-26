import { WalletButtons, WalletHeader, WalletTransactions } from "@components/wallet"
import { SectionHeader } from "@components/general/section/headers"
import { updateWallet } from "@src/services/memory/wallets"
import { Transaction } from "@src/services/memory/types"
import { View, ScrollView, RefreshControl, TouchableOpacity } from "react-native"
import { useEffect, useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import SplashScreen from "@components/general/SplashScreen"
import { useAuth } from "@/src/providers/userProvider"
import theme from "@src/theme"
import { walletService } from "@/src/core/walletManager"
import { useTranslateService } from "@/src/providers/translateProvider"

const WalletManagerScreen = ({ navigation, route }: any) => {

    const { wallet, setWallet } = useAuth()
    const { useTranslate } = useTranslateService()
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [transactions, setTransactions] = useState<Transaction[]>([])

    useEffect(() => {

        // add to header menu wallet options 
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={{ paddingHorizontal: 5, marginHorizontal: 10 }} onPress={() => navigation.navigate("wallet-settings-stack")}>
                    <Ionicons name="ellipsis-vertical-sharp" color={theme.colors.white} size={theme.icons.large} />
                </TouchableOpacity>
            )
        })

        handleLoadTransactions()

        setLoading(false)
    }, [])

    const handleLoadTransactions = async () => {
        setRefreshing(true)

        const address = wallet.address ?? ""
        // search transactions and update wallet lastBalance
        const walletInfo = await walletService.listTransactions(address)

        setTransactions(walletInfo.transactions)

        wallet.lastBalance = walletInfo.balance
        wallet.lastReceived = walletInfo.received
        wallet.lastSended = walletInfo.sended

        await updateWallet(wallet)

        if (setWallet)
            setWallet(wallet)

        setRefreshing(false)
    }

    const openTransaction = (transaction: Transaction) => {
        navigation.navigate("wallet-transaction-stack", transaction)
    }

    if (loading)
        return <SplashScreen />

    return (
        <>
            <WalletHeader wallet={wallet} showOptions={() => navigation.navigate("wallet-settings-stack", { wallet })} />

            <SectionHeader
                icon="repeat-outline"
                label={useTranslate("section.title.transactions")}
                actions={[{ icon: "reload", action: handleLoadTransactions }]}
            />

            <ScrollView
                contentContainerStyle={theme.styles.scroll_container}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleLoadTransactions} />}
            >

                <WalletTransactions transactions={transactions} onPressTransaction={openTransaction} />

                <View style={{ width: "100%", height: 62 }}></View>

            </ScrollView>

            <WalletButtons
                onReceive={() => navigation.navigate("add-wallet-receive-stack", { address: wallet.address })}
                onSend={() => navigation.navigate("wallet-send-stack")}
            />
        </>
    )
}

export default WalletManagerScreen