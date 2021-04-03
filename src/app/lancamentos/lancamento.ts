import { Cliente } from '../clientes/cliente';
import { FormaPagamento } from '../formas-pagamentos/forma-pagamento';
import { Produto } from '../produtos/produto';



export class Lancamento {

    id: number;
    dataCadastro: string;
    dataLancamento: string;
    cliente: Cliente = new Cliente;      
    cep: string;
    bairro: string;
    lagradouro: string;
    complemento: string;  
    numero: string;
    telefone: string;
    celular: string;   
    total: string;
    status: string;    
} 