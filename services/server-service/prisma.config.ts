import dotenv from 'dotenv'
//@ts-ignore
import { defineConfig } from "@prisma/config";

dotenv.config()

export default defineConfig({
    schema : 'src/prisma/schema.prisma',
    migrations : {
        path : 'src/prisma/migrations'
    }
})