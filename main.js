// ATENÇÃO: Substitua pelos dados reais que você pegou no painel do Supabase!
const SUPABASE_URL = 'SUA_URL_DO_SUPABASE_AQUI';
const SUPABASE_ANON_KEY = 'SUA_CHAVE_ANON_AQUI';

// Inicializa a conexão com o Supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- FUNÇÃO PARA O MÓDULO ADMINISTRATIVO (Cadastrar Serviços) ---
async function cadastrarServico(event) {
  event.preventDefault(); // Evita que a página recarregue sozinha

  const nome = document.getElementById('nomeServico').value;
  const preco = document.getElementById('precoServico').value;

  // Insere os dados na tabela 'servicos' do Supabase
  const { data, error } = await supabaseClient
    .from('servicos')
    .insert([{ nome: nome, preco: parseFloat(preco) }]);

  if (error) {
    alert('Erro ao cadastrar serviço: ' + error.message);
  } else {
    alert('Serviço cadastrado com sucesso!');
    document.getElementById('formServico').reset();
  }
}

// --- FUNÇÕES PARA O MÓDULO DO CLIENTE (Agendamento) ---

// Carrega os serviços salvos dentro da caixinha (select) da tela de agendamento
async function carregarServicosSelect() {
  const selectServico = document.getElementById('servicoSelect');
  if (!selectServico) return; // Se não estiver na página index, para a execução

  const { data: servicos, error } = await supabaseClient
    .from('servicos')
    .select('*');

  if (error) {
    console.error('Erro ao buscar serviços:', error.message);
    return;
  }

  // Limpa opções antigas e adiciona as novas vindas do banco
  selectServico.innerHTML = '<option value="">Selecione um serviço...</option>';
  servicos.forEach(servico => {
    const option = document.createElement('option');
    option.value = servico.id;
    option.textContent = `${servico.nome} - R$ ${servico.preco}`;
    selectServico.appendChild(option);
  });
}

// Salva o agendamento feito pelo cliente
async function realizarAgendamento(event) {
  event.preventDefault();

  const cliente_nome = document.getElementById('clienteNome').value;
  const pet_nome = document.getElementById('petNome').value;
  const servico_id = document.getElementById('servicoSelect').value;
  const data_hora = document.getElementById('dataHora').value;

  const { data, error } = await supabaseClient
    .from('agendamentos')
    .insert([{ 
      cliente_nome: cliente_nome, 
      pet_nome: pet_nome, 
      servico_id: servico_id, 
      data_hora: data_hora 
    }]);

  if (error) {
    alert('Erro ao realizar agendamento: ' + error.message);
  } else {
    alert('Agendamento realizado com sucesso! Seu pet será muito bem-vindo.');
    document.getElementById('formAgendamento').reset();
  }
}

// Executa funções automáticas ao carregar as páginas
window.addEventListener('DOMContentLoaded', () => {
  carregarServicosSelect();
});