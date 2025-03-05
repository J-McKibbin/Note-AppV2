import { beforeEach, afterAll } from "bun:test";
import { Prisma } from "@prisma/client";

afterAll( async () => {
  const file = Bun.file("./prisma/test.db");


  if( await file.exists()){
    await file.delete();
  };


  
});