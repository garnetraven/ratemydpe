import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PUT(
  request: Request,
  { params }: { params: { reviewId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { reviewId } = params;

    // Verify the review belongs to the user
    const existingReview = await prisma.review.findUnique({
      where: { id: reviewId },
      select: { userId: true }
    });

    if (!existingReview || existingReview.userId !== session.user.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        content: body.content,
        overallRating: body.overallRating,
        difficultyRating: body.difficultyRating,
        tags: body.tags,
        checkrideType: body.checkrideType,
        checkridePassed: body.checkridePassed,
        wouldRecommend: body.wouldRecommend,
        groundFirst: body.groundFirst,
      },
    });

    return NextResponse.json(updatedReview);
  } catch (error) {
    console.error('Update review error:', error);
    return new NextResponse('Error updating review', { status: 500 });
  }
} 