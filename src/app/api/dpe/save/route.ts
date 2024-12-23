import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { dpeId } = body;

    if (!dpeId) {
      return new NextResponse('Missing DPE ID', { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { savedDPEs: true }
    });

    const isAlreadySaved = user?.savedDPEIds.includes(dpeId);

    if (isAlreadySaved) {
      // Unsave the DPE
      await Promise.all([
        prisma.user.update({
          where: { id: session.user.id },
          data: {
            savedDPEIds: {
              set: user.savedDPEIds.filter(id => id !== dpeId)
            }
          }
        }),
        prisma.dPE.update({
          where: { id: dpeId },
          data: {
            savedByUserIds: {
              set: (await prisma.dPE.findUnique({ where: { id: dpeId } }))?.savedByUserIds.filter(id => id !== session.user.id) || []
            }
          }
        })
      ]);
      return NextResponse.json({ saved: false });
    } else {
      // Save the DPE
      await Promise.all([
        prisma.user.update({
          where: { id: session.user.id },
          data: {
            savedDPEIds: {
              push: dpeId
            }
          }
        }),
        prisma.dPE.update({
          where: { id: dpeId },
          data: {
            savedByUserIds: {
              push: session.user.id
            }
          }
        })
      ]);
      return NextResponse.json({ saved: true });
    }
  } catch (error) {
    console.error('Save DPE error:', error);
    return new NextResponse('Error saving DPE', { status: 500 });
  }
} 