import {
  validarLogin,
  validarSenhaForte,
  validarCadastroUsuario,
  normalizarPreco,
  validarTenis
} from "../validations";

describe("validacoes", () => {
  it("valida login com campos vazios", () => {
    expect(validarLogin("", "")).toBe("Preencha e-mail e senha para entrar!");
  });

  it("aceita login preenchido", () => {
    expect(validarLogin("ana@email.com", "123456")).toBeNull();
  });

  it("valida senha forte", () => {
    expect(validarSenhaForte("abc")).toEqual({
      valida: false,
      requisitosFaltando: [
        "no minimo 8 caracteres",
        "1 letra maiuscula",
        "1 numero",
        "1 caractere especial"
      ],
      mensagem: "A senha precisa conter: no minimo 8 caracteres, 1 letra maiuscula, 1 numero, 1 caractere especial."
    });

    expect(validarSenhaForte("Senha@123")).toEqual({
      valida: true,
      requisitosFaltando: [],
      mensagem: null
    });
  });

  it("bloqueia cadastro com senhas diferentes", () => {
    expect(
      validarCadastroUsuario({
        nome: "Ana",
        email: "ana@email.com",
        senha: "Senha@123",
        confSenha: "Outra@123"
      })
    ).toBe("As senhas nao conferem!");
  });

  it("mostra o que falta na senha do cadastro", () => {
    expect(
      validarCadastroUsuario({
        nome: "Ana",
        email: "ana@email.com",
        senha: "abc",
        confSenha: "abc"
      })
    ).toBe(
      "A senha precisa conter: no minimo 8 caracteres, 1 letra maiuscula, 1 numero, 1 caractere especial."
    );
  });

  it("normaliza preco com virgula", () => {
    expect(normalizarPreco("499,90")).toBe(499.9);
  });

  it("bloqueia tenis sem preco valido", () => {
    expect(validarTenis("Air Max", "abc")).toBe("Informe um preco valido.");
  });
});
