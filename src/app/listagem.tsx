import { auth, db } from "@/lib/firebase";
import { Link } from "expo-router";
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Modal,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

type Tenis = {
    id: string;
    modelo: string;
    preco: number;
    marca: string;
};

export default function ListagemTenis() {
    const [tenis, setTenis] = useState<Tenis[]>([]);
    const [loading, setLoading] = useState(true);
    const [modalVisivel, setModalVisivel] = useState(false);
    const [idEditando, setIdEditando] = useState("");
    const [modeloEdit, setModeloEdit] = useState("");
    const [precoEdit, setPrecoEdit] = useState("");
    const [marcaEdit, setMarcaEdit] = useState("");

    useEffect(() => {
        const user = auth.currentUser;

        if (!user) {
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, "tenis"),
            where("userId", "==", user.uid),
            orderBy("createdAt", "desc")
        );

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const lista: Tenis[] = [];

            querySnapshot.forEach((documento) => {
                lista.push({ ...documento.data(), id: documento.id } as Tenis);
            });

            setTenis(lista);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    async function excluirTenis(id: string) {
        Alert.alert("Excluir", "Deseja remover este tênis?", [
            { text: "Cancelar" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    await deleteDoc(doc(db, "tenis", id));
                }
            }
        ]);
    }

    function abrirModal(item: Tenis) {
        setIdEditando(item.id);
        setModeloEdit(item.modelo);
        setPrecoEdit(item.preco.toString());
        setMarcaEdit(item.marca);
        setModalVisivel(true);
    }

    async function salvarEdicao() {
        if (!modeloEdit || !precoEdit) {
            Alert.alert("Erro", "Preencha os campos!");
            return;
        }

        try {
            const docRef = doc(db, "tenis", idEditando);

            await updateDoc(docRef, {
                modelo: modeloEdit,
                preco: Number(precoEdit.replace(",", ".")),
                marca: marcaEdit
            });

            setModalVisivel(false);
            Alert.alert("Sucesso", "Tênis atualizado!");
        } catch {
            Alert.alert("Erro", "Não foi possível atualizar.");
        }
    }

    if (loading) {
        return <ActivityIndicator style={{ flex: 1 }} size="large" color="#3366FF" />;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus Tênis</Text>

            <Link href="/novoCadastro" asChild>
                <TouchableOpacity style={styles.botaoAdd}>
                    <Text style={styles.botaoAddTexto}>+</Text>
                </TouchableOpacity>
            </Link>

            <FlatList
                data={tenis}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>Nenhum tênis cadastrado.</Text>
                }
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.modeloTenis}>{item.modelo}</Text>
                            <Text style={styles.precoTenis}>R$ {item.preco?.toFixed(2)}</Text>
                            <Text style={styles.marcaTenis}>{item.marca}</Text>
                        </View>

                        <View style={styles.containerAcoes}>
                            <TouchableOpacity style={styles.botaoEditar} onPress={() => abrirModal(item)}>
                                <Text style={styles.textoBotao}>Editar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.botaoExcluir} onPress={() => excluirTenis(item.id)}>
                                <Text style={styles.textoBotao}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />

            <Modal visible={modalVisivel} animationType="fade" transparent={true}>
                <View style={styles.modalFundo}>
                    <View style={styles.modalCard}>
                        <Text style={styles.modalTitulo}>Editar Tênis</Text>
                        
                        <TextInput style={styles.input} value={modeloEdit} onChangeText={setModeloEdit} placeholder="Modelo" />
                        <TextInput style={styles.input} value={precoEdit} onChangeText={setPrecoEdit} placeholder="Preço" keyboardType="numeric" />
                        <TextInput style={styles.input} value={marcaEdit} onChangeText={setMarcaEdit} placeholder="Marca" />

                        <View style={styles.modalBotoes}>
                            <TouchableOpacity style={styles.btnCancelar} onPress={() => setModalVisivel(false)}>
                                <Text>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.btnSalvar} onPress={salvarEdicao}>
                                <Text style={styles.textoSalvar}>Salvar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FDFDFD", padding: 20 },
    title: { fontSize: 24, fontWeight: 900, marginBottom: 20, marginTop: 40, color: "#0929b8" },
    card: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 8,
        marginBottom: 12,
        flexDirection: "row",
        alignItems: "center",
        elevation: 2
    },
    modeloTenis: { fontSize: 18, fontWeight: "bold", color: "#333" },
    precoTenis: { fontSize: 16, color: "#0929b8", fontWeight: "700" },
    marcaTenis: { fontSize: 14, color: "#666" },
    emptyText: { color: "#585860", textAlign: "center", marginTop: 32 },
    botaoAdd: {
        backgroundColor: "#3366FF",
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        bottom: 30,
        right: 20,
        zIndex: 10
    },
    botaoAddTexto: { color: "#fff", fontWeight: "bold", fontSize: 22 },
    containerAcoes: { gap: 8 },
    botaoEditar: { backgroundColor: "#4A90E2", padding: 8, borderRadius: 6 },
    botaoExcluir: { backgroundColor: "#D33F49", padding: 8, borderRadius: 6 },
    textoBotao: { color: "#fff", fontWeight: "bold", fontSize: 12, textAlign: "center" },
    modalFundo: { flex: 1, backgroundColor: "#00000080", justifyContent: "center", alignItems: "center" },
    modalCard: { width: "85%", backgroundColor: "#fff", padding: 20, borderRadius: 8 },
    modalTitulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15, textAlign: "center", color: "#0929b8" },
    input: { borderBottomWidth: 1, borderBottomColor: "#ddd", marginBottom: 15, padding: 8 },
    modalBotoes: { flexDirection: "row", gap: 10, marginTop: 10 },
    btnCancelar: { flex: 1, padding: 12, alignItems: "center", backgroundColor: "#eee", borderRadius: 8 },
    btnSalvar: { flex: 1, padding: 12, alignItems: "center", backgroundColor: "#3366FF", borderRadius: 8 },
    textoSalvar: { color: "#fff", fontWeight: "bold" }
});
