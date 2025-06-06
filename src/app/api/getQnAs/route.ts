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

        const questions = existingData?.current_question;
        const answers = existingData?.current_answer;

        return Response.json(
            { success: true, message: 'QnAs fetched successfully', data: { questions, answers } },
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