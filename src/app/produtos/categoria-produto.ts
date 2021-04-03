import { Adicional } from "./adicional";

export class CategoriaProduto {

    id: number;
    dataCadastro: string;
    nomeCategoriaProduto: string;
    adicionais: Adicional[] =[];
}
