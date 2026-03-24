import { ConvertToUnicode } from './bijoy2uni';
import { ConvertToASCII } from './uni2bijoy';

export function bijoyToUnicode(text: string): string {
    return ConvertToUnicode('bijoy', text);
}

export function unicodeToBijoy(text: string): string {
    return ConvertToASCII('bijoy', text);
}
