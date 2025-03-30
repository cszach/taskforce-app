export async function POST(request: Request) {
  const data = await request.json();
  const { prompt } = data;

  console.log(prompt);

  return Response.json(
    {
      message: "Task created successfully.",
    },
    {
      status: 201,
    }
  );
}
