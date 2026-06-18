import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { auth, debugFirebaseAuthNetwork } from "@/lib/firebase";
import { validarLogin } from "@/utils/validations";

import { Link, useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react"; //hook
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView, StyleSheet, Text, View
} from "react-native";

export default function Index(){
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    

    async function handleSignIn(){
        const erroValidacao = validarLogin(email, senha);

        if (erroValidacao) {
            Alert.alert("Erro", erroValidacao);
            return;
        }

        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, email, senha);
            router.push("/novoCadastro");
        } catch (error: any) {
            console.error("Erro ao entrar no Firebase Auth:", {
                code: error?.code,
                message: error?.message,
                name: error?.name,
                stack: error?.stack
            });
            console.error("Erro completo:", error);

            if (error.code === "auth/network-request-failed") {
                await debugFirebaseAuthNetwork();
            }

            if (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential") {
                Alert.alert("Acesso Negado", "Este e-mail não está cadastrado ou a senha está incorreta.");
            } else if (error.code === "auth/invalid-email") {
                Alert.alert("Erro", "Formato de e-mail inválido.");
            } else if (error.code === "auth/network-request-failed") {
                Alert.alert(
                    "Erro de conexão",
                    "Não foi possível conectar ao Firebase Auth. Verifique internet, variáveis do .env, se o app foi reiniciado após alterar o .env e se o login por e-mail/senha está habilitado no Firebase."
                );
            } else {
                Alert.alert("Erro", "Ocorreu um erro ao tentar entrar. Tente novamente mais tarde.");
            }
        } finally {
            setLoading(false);
        }
    }

    return(
        <KeyboardAvoidingView 
            style={styles.screen}
            behavior={Platform.select({ios:"padding", android:"height"})}
        >

        <ScrollView 
            style={styles.screen}
            contentContainerStyle={{ flexGrow:1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <Image 
                    source={require('@/assets/image1.png')}
                    style={styles.ilustration} 
                />
                <Text style={styles.title}>Entrar</Text>
                <Text style={styles.subtitle}>Acesse sua conta com e-mail e senha</Text>
                <View style={styles.form}>
                    <Input placeholder="E-mail" 
                        keyboardType="email-address" 
                        autoCapitalize="none"
                        // onChangeText={(text) => console.log(text)}
                        onChangeText={setEmail}
                        value={email}
                    />
                    <Input placeholder="Senha" 
                        secureTextEntry
                        onChangeText={setSenha}
                        value={senha}
                        />
                    <Button
                        label={loading ? "Carregando..." : "Entrar"}
                        onPress={handleSignIn}
                        disabled={loading}
                    />
                    {/* <Button label="Entrar" style={{ backgroundColor: "green"}}/> */}
                </View>
                <Text style={styles.footerText}>Não tem uma conta? 
                    <Link href="/signup" style={styles.footerLink}>
                        {" "}Cadastre-se aqui
                    </Link>
                </Text>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
} 

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: "#FDFDFD"
    },
    container: {
        flex:1,
        backgroundColor: "#FDFDFD",
        padding:32
    },
    ilustration:{
        width: "100%",
        height: 330,
        resizeMode:"contain",
        marginTop:62
    }, 
    footerText:{
        textAlign:"center",
        marginTop:24,
        color:"#585860",
    },
    footerLink:{
        color:"#0929b8",
        fontWeight:700
    },
    form: {
        marginTop:24,
        gap:12
    },
    title:{ 
        fontSize: 32,
        fontWeight:900,
    },
    subtitle:{
        fontSize:16,
    },    
})
