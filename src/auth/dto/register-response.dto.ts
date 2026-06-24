export class AuthResponseDto {
    id!: number;
    first_name!: string;
    last_name!: string;
    age!: number | null;
    email!: string;
    role!: string;
    vehicle?: string | null;
    createdAt!: Date;
}