import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock /api/feedback endpoint
  http.post('/api/feedback', async ({ request }) => {
    const body = await request.json();

    // Validate required fields
    if (!body.type || !body.title || !body.description || !body.email) {
      return HttpResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate type
    if (body.type !== 'bug' && body.type !== 'suggestion') {
      return HttpResponse.json(
        { error: 'Invalid type. Must be "bug" or "suggestion"' },
        { status: 400 }
      );
    }

    // Return success response
    return HttpResponse.json({
      success: true,
      data: {
        id: 'test-id-123',
        ...body,
        created_at: new Date().toISOString(),
      },
    });
  }),
];
