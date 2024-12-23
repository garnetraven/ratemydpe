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

    const reviews = await prisma.review.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        content: true,
        overallRating: true,
        difficultyRating: true,
        wouldRecommend: true,
        checkridePassed: true,
        groundFirst: true,
        checkrideType: true,
        tags: true,
        createdAt: true,
        dpe: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    return new NextResponse('Error fetching reviews', { status: 500 });
  }
} 