import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@clerk/nextjs/server';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { orgId } = await auth();
    
    if (!orgId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Organization not found' 
        },
        { status: 401 }
      );
    }

    const reports = await prisma.report.findMany({
      where: {
        organizationId: orgId
      },
      include: {
        organization: {
          select: {
            name: true,
            slug: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match frontend expectations
    const transformedReports = reports.map(report => ({
      id: report.id,
      title: report.title,
      subtitle: report.subtitle,
      organizationName: report.organization.name,
      status: report.status,
      reportType: report.reportType,
      reportStartDate: report.reportStartDate,
      reportEndDate: report.reportEndDate,
      productsAnalyzed: report.productsAnalyzed,
      reviewsAnalyzed: report.reviewsAnalyzed,
      sourcesCount: report.sourcesCount,
      sentimentScore: report.sentimentScore,
      downloadCount: report.downloadCount,
      lastDownloaded: report.lastDownloaded,
      googleDriveUrl: report.googleDriveUrl,
      highlights: report.highlights,
      metadata: report.metadata,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: transformedReports
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch reports' 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
