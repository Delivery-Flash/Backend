export class LoginResponseDto {
  accessToken!: string;
  user!: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
}