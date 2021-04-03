import { Cliente } from '../clientes/cliente';
import { Adicional } from './adicional';
import { CategoriaProduto } from './categoria-produto';
import { TipoProduto } from './tipo-produto';

export class Produto {

    id: number;
    dataCadastro: string;
    nomeProduto: string;
    valorVenda: string;
    valorCompra: string;  
    categoriaProduto: CategoriaProduto;
    tipoProduto: TipoProduto;
    cliente: Cliente;
    

}
