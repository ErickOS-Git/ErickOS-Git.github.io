import { Produto } from '../produtos/produto';
import { Lancamento } from './lancamento';
import { LancamentoAdicional } from './lancamento-adicional';

export class LancamentoProduto {

    id: number;    
    produto: number;
    nomeProduto: string;
    valorVenda: number;
    desconto: number;
    totalProduto: number;
    quantidade: number;
    adicionais: LancamentoAdicional[] = [];
}