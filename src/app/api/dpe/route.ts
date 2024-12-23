import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { CreateDPERequest } from '@/types/models';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(request: Request) {
  try {
    const body: CreateDPERequest = await request.json();
    const { firstName, lastName, city, state, region, checkrideTypes, tags } = body;

    // Validate required fields
    if (!firstName || !lastName || !city || !state || !region || !checkrideTypes?.length) {
      return NextResponse.json({
        error: {
          message: 'Missing required fields',
          received: { firstName, lastName, city, state, region, checkrideTypes }
        }
      }, { status: 400 });
    }

    const dpe = await prisma.dPE.create({
      data: {
        firstName,
        lastName,
        city,
        state,
        region,
        checkrideTypes,
        tags: tags || [],
        createdAt: new Date(),
        savedByUserIds: [],
      },
    });

    return NextResponse.json(dpe);
  } catch (error) {
    console.error('DPE creation error:', error);
    return NextResponse.json({
      error: {
        message: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : 'Unknown'
      }
    }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    const state = searchParams.get('state');

    const where: any = {};
    if (name) {
      where.OR = [
        { firstName: { contains: name, mode: 'insensitive' } },
        { lastName: { contains: name, mode: 'insensitive' } },
      ];
    }
    if (state) {
      where.state = state;
    }

    const dpes = await prisma.dPE.findMany({
      where,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        city: true,
        state: true,
        checkrideTypes: true,
        tags: true,
        reviews: true,
        savedByUserIds: true,
        savedByUsers: {
          select: {
            id: true
          }
        }
      },
    });

    return NextResponse.json(dpes);
  } catch (error) {
    console.error('Error fetching DPEs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch DPEs' },
      { status: 500 }
    );
  }
} 