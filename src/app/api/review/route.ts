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
    const { 
      dpeId, 
      content, 
      overallRating, 
      difficultyRating,
      wouldRecommend,
      checkridePassed,
      groundFirst,
      checkrideType,
      tags 
    } = body;

    const review = await prisma.review.create({
      data: {
        content,
        overallRating,
        difficultyRating,
        wouldRecommend,
        checkridePassed,
        groundFirst,
        checkrideType,
        tags,
        userName: session.user.name || 'Anonymous',
        user: { connect: { id: session.user.id } },
        dpe: { connect: { id: dpeId } }
      }
    });

    return NextResponse.json(review);
  } catch (error) {
    console.error('Review creation error:', error);
    return new NextResponse('Error creating review', { status: 500 });
  }
} 