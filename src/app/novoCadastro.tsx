import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { auth, db } from "@/lib/firebase";
import { normalizarPreco, validarTenis } from "@/utils/validations";
import { useRouter } from "expo-router";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    View
} from "react-native";

export default function NovoCadastro() {
    const [modelo, setModelo] = useState("");
    const [preco, setPreco] = useState("");
    const [marca, setMarca] = useState("");
    const router = useRouter();

    async function salvarTenis() {
        const erroValidacao = validarTenis(modelo, preco);

        if (erroValidacao) {
            Alert.alert("Erro", erroValidacao);
            return;
        }

        const user = auth.currentUser;

        if (!user) {
            Alert.alert("Erro", "Usuário não autenticado!");
            return;
        }

        try {
            await addDoc(collection(db, "tenis"), {
                modelo,
                preco: normalizarPreco(preco),
                marca,
                userId: user.uid,
                createdAt: new Date()
            });

            Alert.alert("Sucesso", "Tênis cadastrado com sucesso!");
            router.push("/listagem");

            setModelo("");
            setPreco("");
            setMarca("");
        } catch (error) {
            console.error("Erro ao salvar no Firestore: ", error);
            Alert.alert("Erro", "Não foi possível salvar o tênis.");
        }
    }

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.select({ ios: "padding", android: "height" })}
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.container}>
                    <Image 
                        source={require("@/assets/image2.png")} 
                        style={styles.ilustration}
                    /> 
                    
                    <Text style={styles.title}>Novo Tênis</Text>
                    <Text style={styles.subtitle}>Cadastre os modelos no sistema</Text>

                    <View style={styles.form}>
                        <Input 
                            placeholder="Modelo do Tênis" 
                            value={modelo}
                            onChangeText={setModelo} 
                        />
                        <Input 
                            placeholder="Preço (Ex: 499.90)" 
                            keyboardType="numeric"
                            value={preco}
                            onChangeText={setPreco} 
                        />
                        <Input 
                            placeholder="Marca do Tênis" 
                            value={marca}
                            onChangeText={setMarca} 
                        />

                        <Button label="Salvar Tênis" onPress={salvarTenis} />

                        <Button
                            label="Ver Lista de Tênis" 
                            onPress={() => router.push("/listagem")} 
                        />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FDFDFD",
        padding: 32
    },
    ilustration: {
        width: "100%",
        height: 180,
        resizeMode: "contain",
        marginTop: 40
    },
    form: {
        marginTop: 24,
        gap: 12
    },
    title: {
        fontWeight: 900,
        fontSize: 32,
        marginTop: 10
    },
    subtitle: {
        fontSize: 16,
        color: "#585860"
    }
});
