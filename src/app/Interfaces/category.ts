// 1. La respuesta estándar del servidor (Genérica)
export interface BaseResponse<T> {
    isSuccess: boolean;
    data: T;
    message: string | null;
    errors: any | null;
}

// 2. Lo que usas para pintar tu tabla principal de Categorías
export interface CategoryResponseDto {
    categoryId: number;
    name: string;
    description: string;
    auditCreateDate: string;
    state: number;
    stateCategory: string;
}

// 3. Lo que usa tu formulario para Registrar o Editar una Categoría
export interface CategoryRequestDto {
    name: string;
    description: string;
    state: number;
}

// 4. Lo que usarás en los combobox/selects más adelante
export interface CategorySelectResponseDto {
    categoryId: number;
    name: string;
}