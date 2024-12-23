import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        savedDPEs: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            city: true,
            state: true,
            region: true,
            checkrideTypes: true,
            tags: true,
            reviews: {
              select: {
                id: true,
                overallRating: true,
                difficultyRating: true,
                content: true,
                createdAt: true,
                userId: true,
                wouldRecommend: true,
                checkridePassed: true,
                groundFirst: true,
                checkrideType: true,
                tags: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json(user?.savedDPEs || []);
  } catch (error) {
    console.error('Fetch saved DPEs error:', error);
    return new NextResponse('Error fetching saved DPEs', { status: 500 });
  }
} 