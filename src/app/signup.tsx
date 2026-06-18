import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { auth, debugFirebaseAuthNetwork } from "@/lib/firebase";
import { validarCadastroUsuario, validarSenhaForte } from "@/utils/validations";

import { Link, router } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView, StyleSheet, Text, View
} from "react-native";

export default function Signup(){
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmaSenha, setConfirmaSenha] = useState("");

    async function handleSignup() {
        const erroValidacao = validarCadastroUsuario({
            nome,
            email,
            senha,
            confSenha: confirmaSenha
        });

        if (erroValidacao) {
            Alert.alert("Erro", erroValidacao);
            return;
        }

        const resultadoSenha = validarSenhaForte(senha);

        if (!resultadoSenha.valida) {
            Alert.alert("Erro", resultadoSenha.mensagem ?? "Senha inválida.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, senha);

            Alert.alert("Sucesso", "Conta criada com sucesso!");
            router.push("/");
        } catch (error: any) {
            console.error("Erro ao criar conta no Firebase Auth:", {
                code: error?.code,
                message: error?.message,
                name: error?.name,
                stack: error?.stack
            });
            console.error("Erro completo:", error);

            if (error.code === "auth/network-request-failed") {
                await debugFirebaseAuthNetwork();
            }

            if (error.code === "auth/email-already-in-use") {
                Alert.alert("Erro", "Este e-mail já está em uso.");
            } else if (error.code === "auth/weak-password") {
                Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
            } else if (error.code === "auth/network-request-failed") {
                Alert.alert(
                    "Erro de conexão",
                    "Não foi possível conectar ao Firebase Auth. Verifique internet, variáveis do .env, se o app foi reiniciado após alterar o .env e se o login por e-mail/senha está habilitado no Firebase."
                );
            } else {
                Alert.alert(
                    "Erro",
                    `Não foi possível criar sua conta.${error?.code ? `\nCódigo: ${error.code}` : ""}`
                );
            }
        }
    }

    return(
        <KeyboardAvoidingView 
                    style={{flex:1}}
                    behavior={Platform.select({ios:"padding", android:"height"})}
        >
        <ScrollView 
            contentContainerStyle={{ flexGrow:1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
        >
            <View style={styles.container}>
                <Image 
                    source={require('@/assets/image2.png')}
                    style={styles.ilustration} 
                />
                <Text style={styles.title}>Cadastrar</Text>
                <Text style={styles.subtitle}>Crie sua conta para acessar</Text>
                <View style={styles.form}>
                    <Input placeholder="Nome" onChangeText={setNome} value={nome}/>
                    <Input placeholder="E-mail" onChangeText={setEmail}
                    keyboardType="email-address" autoCapitalize="none" value={email} />
                    <Input placeholder="Senha" onChangeText={setSenha}
                    secureTextEntry value={senha}/>
                    <Input placeholder="Confirmar Senha" onChangeText={setConfirmaSenha}
                    secureTextEntry value={confirmaSenha}/>
                    <Button label="Cadastrar" 
                        onPress={handleSignup}
                        // disabled={senha !== confirmaSenha || !senha}
                    />
                    {/* <Button label="Entrar" style={{ backgroundColor: "green"}}/> */}
                </View>
                <Text style={styles.footerText}>Já tem uma conta? 
                    <Link href="/" style={styles.footerLink}>
                        {" "}Entre aqui
                    </Link>
                </Text>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
} 

const styles = StyleSheet.create({
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
