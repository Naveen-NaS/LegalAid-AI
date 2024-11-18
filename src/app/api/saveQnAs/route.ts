import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const { userID, questions, answers } = await request.json();
        console.log('User ID: ', userID);
        console.log('Questions: ', questions);
        console.log('Answers: ', answers);

        const dataId = "NRUA01";

        const existingData = await prisma.userCurrentData.findFirst({
            where: {
            DataId: dataId,
            userId: userID
            }
        });

        if (existingData) {
            // If the data exists, update the current_reason field
            const updatedData = await prisma.userCurrentData.update({
            where: { DataId: dataId },
            data: { current_question: questions, current_answer: answers }
            });
            return Response.json(
            { success: true, message: 'QnAs updated successfully', data: updatedData },
            { status: 200 }
            );
        } else {
            // If the data does not exist, create a new record
            const newData = await prisma.userCurrentData.create({
            data: {
                DataId: dataId,
                userId: userID,
                current_question: questions,
                current_answer: answers,
                current_notice: "",
                current_reason: ""
            }
            });
            return Response.json(
            { success: true, message: 'Questions and Answer added successfully', data: newData },
            { status: 201 }
            );
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return Response.json(
            { success: false, message: 'Error processing request' },
            { status: 500 }
        );
    }
}