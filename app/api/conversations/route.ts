
import getCurrentUser from '@/app/actions/getCurrentUser';
import prisma from '@/app/libs/prismadb';
import { equal } from 'assert';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentUser();
        const body = await request.json();
        const {
            userId,
            isGroup,
            members,
            name
        } = body;

        if (!currentUser?.id || !currentUser?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        if (isGroup && (!members || members.length < 2 || !name)) {
            return new NextResponse('Bad Request', { status: 400 });
        }

        if (isGroup) {
            const newConversation = await prisma.conversation.create({
                data: {
                    name,
                    isGroup,
                    users: {
                        connect: [
                            ...members.map((member: { value: string }) => ({ id: member.value })),
                            {
                                id: currentUser.id
                            }
                        ]
                    }
                },
                include: {
                    users: true
                }
            });
            return NextResponse.json(newConversation, { status: 201 });
        }

        const existingConversations = await prisma.conversation.findMany({
            where: {
                OR: [
                    {
                        userIds: {
                            equals: [currentUser.id, userId]
                        }
                    },
                    {
                        userIds: {
                            equals: [userId, currentUser.id]
                        }
                    }
                ]
            }
        })
        const existingConversation = existingConversations[0];

        if (existingConversation) {
            return NextResponse.json(existingConversation, { status: 200 });
        }

        const newConversation = await prisma.conversation.create({
            data: {
                users: {
                    connect: [
                        { id: currentUser.id },
                        { id: userId }
                    ]
                }
            },
            include: {
                users: true
            }
        })
        return NextResponse.json(newConversation, { status: 201 });
    }
    catch (e: any) {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}