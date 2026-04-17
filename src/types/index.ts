import { RowDataPacket } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password: string; // hashed
  role_id: number;

}

export interface SignUpBody {
  first_name: string;
  last_name: string;
  user_name: string;
  email: string;
  password: string; 
}

export interface RoleRow extends RowDataPacket {
  role_id: number;
  role_name: string;
}

export interface JwtPayload {
  id: number;
  email?: string;
  role?: number;
}
