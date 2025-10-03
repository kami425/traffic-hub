export interface KeyCloakUserDto {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  credentials: {
    type: string;
    value: string;
    temporary: boolean;
  }[];
}