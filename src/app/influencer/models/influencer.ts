export interface Influencer {
  id?: string
  nome: string,
  email: string,
  dataNascimento: string,
  cpf: string,
  cep: string,
  endereco: string,
  numero: string,
  complemento: string,
  indigena: string,
  nomeComunidade: string,
  genero: string,
  etnia: string,
  categoriasInstagram: string[],
  cadastroFinalizado: string,
  instagram?: any,
  youtube?: any,
  tiktok?: any
  twitter?: any
  senha: string
  estado: string,
  cidade: string,
  telefone: string
}
