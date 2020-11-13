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
}
