import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const dpe = await prisma.dPE.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        city: true,
        state: true,
        region: true,
        checkrideTypes: true,
        tags: true,
        createdAt: true,
        updatedAt: true,
        reviews: {
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
            user: {
              select: {
                name: true
              }
            }
          }
        }
      }
    });

    if (!dpe) {
      return new NextResponse('DPE not found', { status: 404 });
    }

    return NextResponse.json(dpe);
  } catch (error) {
    console.error('DPE fetch error:', error);
    return new NextResponse('Error fetching DPE', { status: 500 });
  }
} 