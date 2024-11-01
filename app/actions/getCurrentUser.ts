import getSession from "./getSession";
import prisma from "../libs/prismadb";
const getCurrentUser = async() => { 
    try{
        const session = await getSession();

        if(!session?.user?.email)
            return null;

        const currrentUser = await prisma.user.findUnique({
            where: {
                email: session.user.email as string
            }
        });

        if(!currrentUser)
            return null;

        return currrentUser;
    }
    catch(e:any){
        return null;    
        console.error(e);
    }
}

export default getCurrentUser;