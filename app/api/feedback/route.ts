import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { createSupabaseRequestContext } from '@/lib/supabase/server-auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    // Optional authentication - try to get user context but don't require it
    let userId: string | null = null;
    try {
      const { ctx } = await createSupabaseRequestContext(request, 'user');
      userId = ctx?.userClaims?.id || null;
    } catch {
      // Ignore auth errors - feedback can be submitted without authentication
    }

    const body = await request.json();
    const { type, title, description, email, severity, category } = body;

    // Validate required fields
    if (!type || !title || !description || !email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== 'bug' && type !== 'suggestion') {
      return NextResponse.json(
        { error: 'Invalid type. Must be "bug" or "suggestion"' },
        { status: 400 }
      );
    }

    // Insert into Supabase with optional user_id if authenticated
    const { data, error } = await supabase
      .from('feedback_reports')
      .insert({
        type,
        title,
        description,
        email,
        severity: severity || null,
        category: category || null,
        user_id: userId || null, // Associate with user if authenticated
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to submit feedback' },
        { status: 500 }
      );
    }

    // Send email notification using Resend
    try {
      const emailSubject = type === 'bug'
        ? `🐛 Nuevo bug reportado: ${title}`
        : `💡 Nueva sugerencia: ${title}`;

      await resend.emails.send({
        from: 'ByeBut Feedback <noreply@byebut.com>',
        to: 'soporte@byebut.com',
        subject: emailSubject,
        html: `
          <h2>${emailSubject}</h2>
          <p><strong>Tipo:</strong> ${type}</p>
          <p><strong>Título:</strong> ${title}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${userId ? `<p><strong>User ID:</strong> ${userId}</p>` : ''}
          ${severity ? `<p><strong>Severidad:</strong> ${severity}</p>` : ''}
          ${category ? `<p><strong>Categoría:</strong> ${category}</p>` : ''}
          <p><strong>Descripción:</strong></p>
          <p>${description.replace(/\n/g, '<br>')}</p>
          <hr />
          <p><small>Report ID: ${data.id}</small></p>
          <p><small>Enviado el: ${new Date().toLocaleString('es-UY')}</small></p>
        `,
      });
    } catch (emailError) {
      console.error('Resend error:', emailError);
      // Don't fail the request if email fails, just log it
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
