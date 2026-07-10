export async function POST(req) {
  try {
    const body = await req.json();
    const { image } = body;
    
    if (!image) {
      return new Response(JSON.stringify({ error: "No image provided" }), { status: 400 });
    }

    // AI Gateway integration goes here
    const mockSchema = {
      patientName: "John Doe",
      medications: [
        {
          medicineName: "Amoxicillin",
          dosage: "500 mg",
          schedule: { morning: true, afternoon: false, night: true },
          mealInstruction: "After Food",
          specialNotes: "Complete full course"
        }
      ]
    };

    return new Response(JSON.stringify(mockSchema), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
