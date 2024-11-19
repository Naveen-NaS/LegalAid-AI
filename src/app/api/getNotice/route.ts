import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userID } = await request.json();
        console.log('User ID: ', userID);

        const dataId = "NRUA01";

        const existingData = await prisma.userCurrentData.findFirst({
            where: {
            DataId: dataId,
            userId: userID
            }
        });

        const notice_response = existingData?.current_notice;

        return Response.json(
            { success: true, message: 'Notice fetched successfully', data: { notice_response } },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error processing request:', error);
        return Response.json(
            { success: false, message: 'Error processing request' },
            { status: 500 }
        );
    }
}