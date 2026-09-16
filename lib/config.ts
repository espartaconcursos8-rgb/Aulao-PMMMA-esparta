/**
 * Configuração do evento.
 *
 * Edite os valores abaixo quando as informações reais estiverem definidas.
 * Tudo marcado como "A DEFINIR" aparece assim no site até você trocar o texto.
 * Não é necessário mexer em nenhum outro arquivo para atualizar esses dados.
 */

export const evento = {
  nome: "Aulão Esparta",
  subtitulo: "Missão Aprovação",
  concurso: "PMMA",

  data: "A DEFINIR",
  horario: "A DEFINIR",

  local: "A DEFINIR",
  endereco: "A DEFINIR",

  precoCentavos: 0, // ex: 4990 = R$ 49,90 — ATUALIZAR antes de abrir as vendas

  totalVagas: 150,
};

export const sobreAulao = {
  titulo: "Um dia inteiro dedicado à sua aprovação",
  paragrafos: [
    "O Aulão Esparta é um encontro intensivo de revisão para quem está na reta final de preparação para o concurso da Polícia Militar do Maranhão.",
    "Conteúdo A DEFINIR — descreva aqui o formato do aulão (carga horária, se é presencial ou online, o que o aluno leva para casa).",
  ],
};

export type ItemProgramacao = {
  horario: string;
  titulo: string;
  descricao: string;
};

export const programacao: ItemProgramacao[] = [
  {
    horario: "A DEFINIR",
    titulo: "Matéria A DEFINIR",
    descricao: "Conteúdo a ser confirmado.",
  },
  {
    horario: "A DEFINIR",
    titulo: "Matéria A DEFINIR",
    descricao: "Conteúdo a ser confirmado.",
  },
];
