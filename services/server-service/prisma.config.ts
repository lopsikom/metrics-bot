import dotenv from 'dotenv'
//@ts-ignore
import { defineConfig } from "@prisma/config";

dotenv.config()

export default defineConfig({
    schema : 'prisma/schema.prisma',
    migrations : {
        path : 'prisma/migrations'
    }
})