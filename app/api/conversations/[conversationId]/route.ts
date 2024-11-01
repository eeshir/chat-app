import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";
import { pusherServer } from "@/app/libs/pusher";

interface IParams {
    conversationId?: string;
}

export async function DELETE(request: Request, { params }: { params: IParams }) {
    try {
        const { conversationId } = params;
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const exisingConversation = await prisma.conversation.findUnique({
            where: {
                id: conversationId
            },
            include: {
                users: true
            }
        })

        if (!exisingConversation) {
            return new NextResponse('Conversation not found', { status: 404 });
        }

        const deletedConversation = await prisma.conversation.deleteMany({
            where: {
                id: conversationId,
                userIds: {
                    hasSome: [currentUser.id]
                }
            }
        });

        exisingConversation.users.forEach( (user) => {
            if(user.email){
                pusherServer.trigger(user.email, 'conversation:remove',exisingConversation )
            }
        })

        return NextResponse.json(deletedConversation);
    }
    catch (error: any) {
        console.log(error, 'Error_conversation_delete');
        return new NextResponse('Internal Error', { status: 500 });
    }
}