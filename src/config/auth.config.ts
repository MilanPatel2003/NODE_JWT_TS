import dotenv from "dotenv"
dotenv.config()
export default {
    secret: process.env.JWT_SECRET as string,
    expire:parseInt(process.env.JWT_EXPIRE as string)
}