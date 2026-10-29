// auth.js — depende de supabaseClient.js carregado antes deste arquivo

// ---------- CADASTRO (nome, e-mail, senha) ----------
async function cadastrarUsuario(nome, email, senha) {
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: senha,
    options: { data: { full_name: nome } }
  });

  if (error) {
    console.error("Erro no cadastro:", error.message);
    return { sucesso: false, mensagem: traduzErro(error.message) };
  }
  return { sucesso: true, usuario: data.user };
}

// ---------- LOGIN (e-mail, senha) ----------
async function logarUsuario(email, senha) {
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: senha
  });

  if (error) {
    console.error("Erro no login:", error.message);
    return { sucesso: false, mensagem: traduzErro(error.message) };
  }
  return { sucesso: true, usuario: data.user, sessao: data.session };
}

// ---------- LOGIN COM GOOGLE ----------
async function logarComGoogle() {
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin + "/index.html" }
  });
  if (error) {
    console.error("Erro no login com Google:", error.message);
    return { sucesso: false, mensagem: error.message };
  }
  return { sucesso: true };
}

// ---------- LOGOUT ----------
async function deslogarUsuario() {
  const { error } = await supabaseClient.auth.signOut();
  if (error) {
    console.error("Erro no logout:", error.message);
    return { sucesso: false };
  }
  window.location.href = "login.html";
  return { sucesso: true };
}

// ---------- USUÁRIO LOGADO ----------
async function usuarioAtual() {
  const { data } = await supabaseClient.auth.getUser();
  return data.user; // null se não estiver logado
}

// ---------- Atualiza o cabeçalho (avatar/nome) em qualquer página ----------
async function atualizarHeaderUsuario() {
  const user = await usuarioAtual();
  const nomeEl = document.querySelector(".profile-name");
  const avatarEl = document.querySelector(".profile-mini .avatar");
  if (!user) return; // não logado: mantém "Usuário" padrão

  const nome = user.user_metadata?.full_name || user.email;
  if (nomeEl) nomeEl.textContent = nome;
  if (avatarEl) avatarEl.textContent = nome.charAt(0).toUpperCase();
}

// ---------- Mensagens de erro amigáveis ----------
function traduzErro(mensagem) {
  if (mensagem.includes("already registered")) return "Este e-mail já está cadastrado.";
  if (mensagem.includes("Invalid login credentials")) return "E-mail ou senha incorretos.";
  if (mensagem.includes("Password should be at least")) return "A senha deve ter no mínimo 6 caracteres.";
  return mensagem;
}
