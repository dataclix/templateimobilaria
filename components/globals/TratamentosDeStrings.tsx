// components/globals/TratamentosDeStrings.tsx

export function removeAccents(str: string): string {
    if (!str) {
        return '';
    }
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export const filterOption = (input: string, option?: { label: string; value: string }) => {
    if (!option) {
        return false; 
    }

    const optionLabel = removeAccents(option.label);
    return optionLabel.toLowerCase().includes(removeAccents(input.toLowerCase()));
};