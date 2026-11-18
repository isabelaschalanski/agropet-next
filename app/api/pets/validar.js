import { exigir } from '../../../lib/api';
import { PORTES } from '../../../lib/regras';

export const TIPOS = ['Cachorro', 'Gato', 'Pássaro', 'Peixe', 'Roedor', 'Outro'];

export function dadosDoPet(b) {
    exigir(b.nome && String(b.nome).trim(), 'Informe o nome do pet');
    exigir(TIPOS.includes(b.tipo), 'Tipo de pet inválido');
    exigir(PORTES[b.porte], 'Porte inválido');
    return {
        nome: String(b.nome).trim(), tipo: b.tipo, porte: b.porte,
        raca: String(b.raca || ''), sexo: String(b.sexo || ''), nascimento: String(b.nascimento || ''),
    };
}
